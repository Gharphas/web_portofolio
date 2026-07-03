import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';

interface GooeyNavItem {
  label: string;
  href: string;
}

export interface GooeyNavProps {
  items: readonly GooeyNavItem[] | GooeyNavItem[];
  activeIndex?: number;
  onChange?: (index: number) => void;
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
}

const GooeyNav: React.FC<GooeyNavProps> = ({
  items,
  activeIndex: controlledActiveIndex,
  onChange,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [80, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4]
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLUListElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  
  const [internalActiveIndex, setInternalActiveIndex] = useState<number>(0);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;

  const noise = (n = 1) => n / 2 - Math.random() * n;
  const getXY = (distance: number, pointIndex: number, totalPoints: number): [number, number] => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };
  
  const createParticle = (i: number, t: number, d: [number, number], r: number) => {
    const rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10
    };
  };

  const makeParticles = (element: HTMLElement) => {
    const d: [number, number] = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty('--time', `${bubbleTime}ms`);
    
    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove('active');
      
      setTimeout(() => {
        const particle = document.createElement('span');
        const point = document.createElement('span');
        particle.classList.add('particle');
        particle.style.setProperty('--start-x', `${p.start[0]}px`);
        particle.style.setProperty('--start-y', `${p.start[1]}px`);
        particle.style.setProperty('--end-x', `${p.end[0]}px`);
        particle.style.setProperty('--end-y', `${p.end[1]}px`);
        particle.style.setProperty('--time', `${p.time}ms`);
        particle.style.setProperty('--scale', `${p.scale}`);
        particle.style.setProperty('--color', `var(--color-${p.color}, var(--primary))`);
        particle.style.setProperty('--rotate', `${p.rotate}deg`);
        point.classList.add('point');
        particle.appendChild(point);
        element.appendChild(particle);
        
        requestAnimationFrame(() => {
          element.classList.add('active');
        });
        
        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {}
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element: HTMLElement) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();
    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    // Only block the click if we are already on the target page/location.
    // If the link goes to a home page section (e.g. starting with '#' or '/#') but we are not on the home page,
    // we should allow it to trigger navigation.
    const isLinkToHomeSection = items[index]?.href.startsWith('#') || items[index]?.href.startsWith('/#');
    const isCurrentPageHome = typeof window !== 'undefined' && window.location.pathname === '/';
    
    if (isLinkToHomeSection && isCurrentPageHome) {
      e.preventDefault();
    }
    
    if (activeIndex === index && (isLinkToHomeSection ? isCurrentPageHome : true)) {
      return;
    }
    
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    
    if (onChange) {
      onChange(index);
    }

    const liEl = e.currentTarget.parentElement;
    if (liEl) {
      updateEffectPosition(liEl);
      if (filterRef.current) {
        const particles = filterRef.current.querySelectorAll('.particle');
        particles.forEach(p => filterRef.current!.removeChild(p));
        makeParticles(filterRef.current);
      }
    }

    if (textRef.current) {
      textRef.current.classList.remove('active');
      void textRef.current.offsetWidth;
      textRef.current.classList.add('active');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        const fakeEvent = {
          currentTarget: e.currentTarget,
          preventDefault: () => {}
        } as unknown as React.MouseEvent<HTMLAnchorElement>;
        handleClick(fakeEvent, index);
      }
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;
    const activeLi = navRef.current.querySelectorAll('li')[activeIndex] as HTMLElement;
    if (activeLi) {
      updateEffectPosition(activeLi);
      textRef.current?.classList.add('active');
      filterRef.current?.classList.add('active');
    } else {
      textRef.current?.classList.remove('active');
      filterRef.current?.classList.remove('active');
    }
    
    const resizeObserver = new ResizeObserver(() => {
      const currentActiveLi = navRef.current?.querySelectorAll('li')[activeIndex] as HTMLElement;
      if (currentActiveLi) {
        updateEffectPosition(currentActiveLi);
      }
    });
    
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  return (
    <>
      <svg className="absolute w-0 h-0" width="0" height="0" version="1.1" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="gooey-nav-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <style>
        {`
          :root {
            --linear-ease: linear(0, 0.068, 0.19 2.7%, 0.804 8.1%, 1.037, 1.199 13.2%, 1.245, 1.27 15.8%, 1.274, 1.272 17.4%, 1.249 19.1%, 0.996 28%, 0.949, 0.928 33.3%, 0.926, 0.933 36.8%, 1.001 45.6%, 1.013, 1.019 50.8%, 1.018 54.4%, 1 63.1%, 0.995 68%, 1.001 85%, 1);
            --color-1: var(--primary);
            --color-2: var(--accent);
            --color-3: #FF8A00;
            --color-4: #FF2D55;
          }
          .effect {
            position: absolute;
            opacity: 0;
            pointer-events: none;
            display: grid;
            place-items: center;
            z-index: 1;
            transition: left 0.38s var(--linear-ease), 
                        top 0.38s var(--linear-ease), 
                        width 0.38s var(--linear-ease), 
                        height 0.38s var(--linear-ease),
                        opacity 0.25s ease;
          }
          .effect.active {
            opacity: 1;
          }
          .effect.text {
            color: var(--primary-foreground, white);
            z-index: 2;
            font-size: 0.875rem;
            font-weight: 500;
          }
          .effect.filter {
            filter: url(#gooey-nav-filter);
            z-index: 1;
          }
          .effect.filter::after {
            content: "";
            position: absolute;
            inset: 0;
            background: var(--primary);
            transform: scale(0);
            opacity: 0;
            z-index: -1;
            border-radius: 9999px;
            box-shadow: 0 0 12px var(--crimson-glow);
          }
          .effect.active::after {
            animation: pill 0.3s ease both;
          }
          @keyframes pill {
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
          .particle,
          .point {
            display: block;
            opacity: 0;
            width: 14px;
            height: 14px;
            border-radius: 9999px;
            transform-origin: center;
          }
          .particle {
            --time: 5s;
            position: absolute;
            top: calc(50% - 7px);
            left: calc(50% - 7px);
            animation: particle calc(var(--time)) ease 1 -350ms;
          }
          .point {
            background: var(--color);
            opacity: 1;
            animation: point calc(var(--time)) ease 1 -350ms;
          }
          @keyframes particle {
            0% {
              transform: rotate(0deg) translate(calc(var(--start-x)), calc(var(--start-y)));
              opacity: 1;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            70% {
              transform: rotate(calc(var(--rotate) * 0.5)) translate(calc(var(--end-x) * 1.2), calc(var(--end-y) * 1.2));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: rotate(calc(var(--rotate) * 0.66)) translate(calc(var(--end-x)), calc(var(--end-y)));
              opacity: 1;
            }
            100% {
              transform: rotate(calc(var(--rotate) * 1.2)) translate(calc(var(--end-x) * 0.5), calc(var(--end-y) * 0.5));
              opacity: 1;
            }
          }
          @keyframes point {
            0% {
              transform: scale(0);
              opacity: 0;
              animation-timing-function: cubic-bezier(0.55, 0, 1, 0.45);
            }
            25% {
              transform: scale(calc(var(--scale) * 0.25));
            }
            38% {
              opacity: 1;
            }
            65% {
              transform: scale(var(--scale));
              opacity: 1;
              animation-timing-function: ease;
            }
            85% {
              transform: scale(var(--scale));
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
          li.active {
            color: transparent !important;
            text-shadow: none !important;
          }
          li.active a {
            color: transparent !important;
          }
        `}
      </style>
      <div className="relative" ref={containerRef}>
        <nav className="flex relative" style={{ transform: 'translate3d(0,0,0.01px)' }}>
          <ul
            ref={navRef}
            className="flex gap-1 list-none p-0 px-1 m-0 relative z-[3]"
          >
            {items.map((item, index) => (
              <li
                key={item.href}
                className={`rounded-full relative cursor-pointer transition-colors duration-300 ease ${
                  activeIndex === index ? 'active' : ''
                }`}
              >
                <Link
                  href={item.href}
                  onClick={e => handleClick(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  className="outline-none py-[0.5rem] px-[1rem] inline-block font-sans text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span className="effect filter" ref={filterRef} />
        <span className="effect text" ref={textRef} />
      </div>
    </>
  );
};

export default GooeyNav;
