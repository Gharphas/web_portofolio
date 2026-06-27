/* eslint-disable react/no-unknown-property */
'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, extend, type ThreeElement, type ThreeEvent, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
  type RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import { motion } from 'framer-motion';

const cardGLB = '/assets/lanyard/card.glb';
const lanyard = '/assets/lanyard/lanyard.png';

extend({ MeshLineGeometry, MeshLineMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: ThreeElement<typeof MeshLineGeometry>;
    meshLineMaterial: Omit<ThreeElement<typeof MeshLineMaterial>, 'args'> & { args?: [any] };
  }
}

// 1x1 transparent pixel — lets useTexture be called unconditionally when a
// front/back image isn't supplied.
const BLANK_PIXEL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// The card model's front face is UV-mapped to the LEFT half of the texture
// atlas and the back face to the RIGHT half (measured from card.glb). Each
// custom image is composited into its own half so the two faces render
// independently, aspect-preserving (no stretching).
const FRONT_UV_RECT = { x: 0, y: 0, w: 0.5, h: 0.755 };
const BACK_UV_RECT = { x: 0.5, y: 0, w: 0.5, h: 0.757 };

interface LanyardProps {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  lanyardColor?: string;
  lanyardTextured?: boolean;
  className?: string;
}

export default function Lanyard({
  position = [0, 0, 20],
  gravity = [0, -40, 0],
  fov = 17,
  transparent = true,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  lanyardColor = '#ff1744',
  lanyardTextured = true,
  className = "w-full h-[580px]"
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [retryKey, setRetryKey] = useState(0);
  const retryCount = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pointerEvents, setPointerEvents] = useState<'auto' | 'none'>('none');
  const cardScreenPos = useRef({ x: 0, y: 0 });
  const isMouseDown = useRef(false);
  const glRef = useRef<THREE.WebGLRenderer | null>(null);

  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    try {
      const isSupported = !!window.WebGLRenderingContext;
      setWebglSupported(isSupported);
    } catch (e) {
      setWebglSupported(false);
    }
    const handleResize = (): void => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleMouseDown = () => { isMouseDown.current = true; };
    const handleMouseUp = () => { isMouseDown.current = false; };
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const dx = mouseX - cardScreenPos.current.x;
      const dy = mouseY - cardScreenPos.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 200 || isMouseDown.current) {
        setPointerEvents('auto');
      } else {
        setPointerEvents('none');
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleWebGLError = () => {
    if (retryCount.current < 2) {
      retryCount.current += 1;
      console.warn(`Lanyard: WebGL error, retrying (${retryCount.current}/2)...`);
      setTimeout(() => setRetryKey(k => k + 1), 500);
    } else {
      console.error('Lanyard: Max WebGL retries reached. Falling back to 2D card.');
      setWebglSupported(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${className}`}
      style={{ pointerEvents: webglSupported ? pointerEvents : 'auto', overflow: 'visible' }}
    >
      {webglSupported ? (
        <Canvas
          key={retryKey}
          camera={{ position, fov }}
          dpr={[1, 1.5]}
          gl={{ alpha: transparent }}
          frameloop="always"
          style={{ overflow: 'visible', pointerEvents: 'auto' }}
          onCreated={({ gl }) => {
            glRef.current = gl;
            gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1);
            // Listen for context lost on the R3F Canvas
            const canvas = gl.domElement;
            canvas.addEventListener('webglcontextlost', (e) => {
              e.preventDefault();
              console.warn('Lanyard: WebGL context lost');
              handleWebGLError();
            });
          }}
          onError={() => handleWebGLError()}
        >
          <ambientLight intensity={Math.PI} />
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
            <Band
              isMobile={isMobile}
              frontImage={frontImage}
              backImage={backImage}
              imageFit={imageFit}
              lanyardImage={lanyardImage}
              lanyardWidth={lanyardWidth}
              lanyardColor={lanyardColor}
              lanyardTextured={lanyardTextured}
              cardScreenPos={cardScreenPos}
            />
          </Physics>
          <Environment blur={0.75}>
            <Lightformer
              intensity={2}
              color="white"
              position={[0, -1, 5]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[-1, -1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={3}
              color="white"
              position={[1, 1, 1]}
              rotation={[0, 0, Math.PI / 3]}
              scale={[100, 0.1, 1]}
            />
            <Lightformer
              intensity={10}
              color="white"
              position={[-10, 0, 14]}
              rotation={[0, Math.PI / 2, Math.PI / 3]}
              scale={[100, 10, 1]}
            />
          </Environment>
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative w-[280px] h-[440px] rounded-2xl border border-white/10 bg-zinc-900/40 backdrop-blur-md overflow-hidden flex flex-col items-center justify-between p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer group"
            whileHover={{
              y: -10,
              transition: { duration: 0.2, ease: 'easeOut' }
            }}
          >
            {/* Lanyard Strap Loop design */}
            <div className="absolute top-0 w-2 h-14 bg-gradient-to-b from-primary to-primary/60 rounded-b-md left-1/2 -translate-x-1/2" />
            <div className="absolute top-10 w-6 h-6 rounded-full bg-zinc-950 border border-white/20 flex items-center justify-center left-1/2 -translate-x-1/2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary" />
            </div>

            {/* Card content */}
            <div className="mt-12 w-full flex flex-col items-center gap-4 text-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-primary/30 shadow-lg group-hover:border-primary transition-all duration-300">
                <img
                  src={frontImage || '/images/profile.jpg'}
                  alt="Profile avatar"
                  className="w-full h-full object-cover"
                  onError={e => {
                    const t = e.target as HTMLImageElement;
                    t.src = '/images/profile.jpg';
                  }}
                />
              </div>
              <div className="space-y-1">
                <h4 className="text-xl font-heading font-bold text-foreground">Jemi Arian</h4>
                <p className="text-xs text-primary font-heading font-semibold tracking-wider uppercase">Full Stack Developer</p>
              </div>
            </div>

            {/* Card Footer Details */}
            <div className="w-full border-t border-white/5 pt-4 flex flex-col items-center gap-1 text-[11px] text-muted-foreground font-sans">
              <span className="font-semibold text-white/70 tracking-wider">ID: JA-2026</span>
              <span>Rianpedia Studio</span>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

interface BandProps {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
  frontImage?: string | null;
  backImage?: string | null;
  imageFit?: 'cover' | 'contain';
  lanyardImage?: string | null;
  lanyardWidth?: number;
  lanyardColor?: string;
  lanyardTextured?: boolean;
  cardScreenPos?: React.MutableRefObject<{ x: number; y: number }>;
}

type LanyardRigidBody = RapierRigidBody & {
  lerped?: THREE.Vector3;
};

function Band({
  maxSpeed = 50,
  minSpeed = 0,
  isMobile = false,
  frontImage = null,
  backImage = null,
  imageFit = 'cover',
  lanyardImage = null,
  lanyardWidth = 1,
  lanyardColor = '#ff1744',
  lanyardTextured = true,
  cardScreenPos
}: BandProps) {
  const { viewport } = useThree();
  const viewportWidth = viewport.width;
  const xOffset = isMobile ? 0 : -viewportWidth / 3;

  const band = useRef<THREE.Mesh<InstanceType<typeof MeshLineGeometry>, InstanceType<typeof MeshLineMaterial>>>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<LanyardRigidBody>(null!);
  const j2 = useRef<LanyardRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();

  const segmentProps: RigidBodyProps = {
    type: 'dynamic',
    canSleep: true,
    colliders: false,
    angularDamping: 4,
    linearDamping: 4
  };

  const getLerped = (body: LanyardRigidBody): THREE.Vector3 => {
    if (!body.lerped) {
      body.lerped = new THREE.Vector3().copy(body.translation());
    }

    return body.lerped;
  };

  const { nodes, materials } = useGLTF(cardGLB) as any;
  const texture = useTexture(lanyardImage || lanyard);
  // useTexture must be called unconditionally; use a blank pixel when an image
  // isn't supplied for a given face, then skip compositing it below.
  const frontTex = useTexture(frontImage || BLANK_PIXEL);
  const backTex = useTexture(backImage || BLANK_PIXEL);

  // Composite the front/back images into the card's texture atlas (front = left
  // half, back = right half). Each image is drawn aspect-preserving (no stretch).
  const cardMap = useMemo(() => {
    const baseMap = materials.base.map as THREE.Texture;
    if (!frontImage && !backImage) return baseMap;

    const baseImg = baseMap.image as any;
    const W = baseImg.width;
    const H = baseImg.height;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return baseMap;
    // Keep the original baked atlas for the card edges and any untouched face.
    ctx.drawImage(baseImg, 0, 0, W, H);

    const drawFitted = (img: any, rect: typeof FRONT_UV_RECT) => {
      const rx = rect.x * W;
      const ry = rect.y * H;
      const rw = rect.w * W;
      const rh = rect.h * H;
      const pick = imageFit === 'contain' ? Math.min : Math.max;
      const scale = pick(rw / img.width, rh / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = rx + (rw - dw) / 2;
      const dy = ry + (rh - dh) / 2;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rx, ry, rw, rh);
      ctx.clip();
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    if (frontImage && frontTex.image) drawFitted(frontTex.image, FRONT_UV_RECT);
    if (backImage && backTex.image) drawFitted(backTex.image, BACK_UV_RECT);

    const composite = new THREE.CanvasTexture(canvas);
    composite.colorSpace = THREE.SRGBColorSpace;
    composite.flipY = baseMap.flipY;
    composite.anisotropy = 16;
    composite.needsUpdate = true;
    return composite;
  }, [frontImage, backImage, imageFit, frontTex, backTex, materials.base.map]);
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0]
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? 'grabbing' : 'grab';
      return () => {
        document.body.style.cursor = 'auto';
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && typeof dragged !== 'boolean') {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z
      });
    }
    if (fixed.current) {
      [j1, j2].forEach(ref => {
        const lerped = getLerped(ref.current);
        const clampedDistance = Math.max(0.1, Math.min(1, lerped.distanceTo(ref.current.translation())));
        lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
      });
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(getLerped(j2.current));
      curve.points[2].copy(getLerped(j1.current));
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));
      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation());
      card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z }, true);

      // Project 3D translation of card to 2D screen coordinates
      if (state.gl && cardScreenPos) {
        const tempV = new THREE.Vector3().copy(card.current.translation());
        tempV.project(state.camera);
        const width = state.gl.domElement.clientWidth;
        const height = state.gl.domElement.clientHeight;
        const x = (tempV.x * 0.5 + 0.5) * width;
        const y = (tempV.y * -0.5 + 0.5) * height;
        cardScreenPos.current = { x, y };
      }
    }
  });

  curve.curveType = 'chordal';
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  // Generate a dynamic lanyard texture with the text "jemi arian - Rianpedia"
  const dynamicTexture = useMemo(() => {
    if (typeof window === 'undefined') return new THREE.Texture();

    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.Texture();

    // Set colors based on the theme/textured state
    const bgCol = lanyardTextured ? lanyardColor : '#ffffff';
    const textCol = lanyardTextured ? '#ffffff' : '#ff1744';

    // Fill background
    ctx.fillStyle = bgCol;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text
    ctx.fillStyle = textCol;
    ctx.font = 'bold 88px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text centered on the canvas
    const text = 'jemi arian - Rianpedia';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 16;
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.needsUpdate = true;
    return tex;
  }, [lanyardColor, lanyardTextured]);

  const finalTexture = dynamicTexture;

  return (
    <>
      <group position={[xOffset, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type="dynamic">
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).releasePointerCapture(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: ThreeEvent<PointerEvent>) => {
              (e.target as Element).setPointerCapture(e.pointerId);
              drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardMap}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="#ffffff"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap={1}
          map={finalTexture}
          repeat={[-3, 1]}
          lineWidth={lanyardWidth}
        />
      </mesh>
    </>
  );
}
