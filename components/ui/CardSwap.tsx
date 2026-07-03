"use client";

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useImperativeHandle
} from 'react';
import gsap from 'gsap';

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: ReactNode;
  onActiveIndexChange?: (index: number) => void;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export interface CardSwapHandle {
  next: () => void;
  prev: () => void;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/90 dark:bg-zinc-950/95 text-foreground shadow-2xl backdrop-blur-md [transform-style:preserve-3d] [will-change:transform] [backface-visibility:hidden] ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
));
Card.displayName = 'Card';

type CardRef = RefObject<HTMLDivElement | null>;
interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const CardSwap = forwardRef<CardSwapHandle, CardSwapProps>(({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children,
  onActiveIndexChange
}, ref) => {
  const config = useMemo(() => 
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        },
    [easing]
  );

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr]);

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const container = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  // Refs to store swap functions for ref-based invocation
  const swapRef = useRef<(() => void) | null>(null);
  const swapBackRef = useRef<(() => void) | null>(null);

  useImperativeHandle(ref, () => ({
    next: () => {
      if (swapRef.current) swapRef.current();
    },
    prev: () => {
      if (swapBackRef.current) swapBackRef.current();
    }
  }));

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount);
      }
    });

    // Notify parent of initial active index on mount
    if (onActiveIndexChange && order.current.length > 0) {
      onActiveIndexChange(order.current[0]);
    }

    const swap = () => {
      if (order.current.length < 2 || isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      // Reset auto interval so that a manual swap pushes the next auto swap back by the full delay duration
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(swap, delay);
      }

      const [front, ...rest] = order.current;
      const elFront = refs[front].current!;
      const tl = gsap.timeline();
      tlRef.current = tl;

      // Notify parent of the upcoming active card index when swap starts
      if (onActiveIndexChange) {
        onActiveIndexChange(rest[0]);
      }

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
        isAnimatingRef.current = false;
      });
    };

    const swapBack = () => {
      if (order.current.length < 2 || isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      // Reset auto interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(swap, delay);
      }

      const back = order.current[order.current.length - 1];
      const rest = order.current.slice(0, -1);
      const elBack = refs[back].current!;
      const tl = gsap.timeline();
      tlRef.current = tl;

      if (onActiveIndexChange) {
        onActiveIndexChange(back);
      }

      // First set zIndex of the back card to be on top of everyone
      gsap.set(elBack, { zIndex: refs.length + 1 });

      // Move it down/drop it to prep for sliding in from the bottom
      tl.set(elBack, { y: '+=500' });

      // Slide it back to slot 0 (centered)
      const frontSlot = makeSlot(0, cardDistance, verticalDistance, refs.length);
      tl.to(elBack, {
        x: frontSlot.x,
        y: frontSlot.y,
        z: frontSlot.z,
        duration: config.durReturn,
        ease: config.ease
      });

      // Demote all other cards back by 1 slot
      tl.addLabel('demote', `-=${config.durReturn * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current!;
        const slot = makeSlot(i + 1, cardDistance, verticalDistance, refs.length);
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          'demote'
        );
        tl.call(() => {
          gsap.set(el, { zIndex: slot.zIndex });
        }, undefined, 'demote');
      });

      tl.call(() => {
        order.current = [back, ...rest];
        isAnimatingRef.current = false;
      });
    };

    swapRef.current = swap;
    swapBackRef.current = swapBack;

    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current!;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }
    return () => clearInterval(intervalRef.current);
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, refs, onActiveIndexChange, config]);

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
            
            // Clicking the active/front card triggers swap to next card
            if (order.current[0] === i && swapRef.current) {
              swapRef.current();
            }
          }
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  );

  return (
    <div
      ref={container}
      className="relative mx-auto perspective-[900px] overflow-visible"
      style={{ width, height }}
    >
      {rendered}
    </div>
  );
});
CardSwap.displayName = 'CardSwap';

export default CardSwap;
