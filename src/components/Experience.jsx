import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useScroll, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function Axum() {
  const group = useRef();
  const { nodes } = useGLTF("/axum.glb");

  return (
    <group ref={group} position={[0, -1.5, 0]}>
      <mesh
        geometry={nodes.The_Obelisk_Of_Axum.geometry}
        material={nodes.The_Obelisk_Of_Axum.material}
      />
    </group>
  );
}

useGLTF.preload("/axum.glb");

function AnimatedAxum() {
  const ref = useRef();
  const scroll = useScroll();
  const { scene } = useThree();
  const [glow, setGlow] = useState(false);

  useEffect(() => {
    scene.background = new THREE.Color(1, 1, 1); // Initial background color white
  }, [scene]);

  useFrame(() => {
    const section = Math.floor(scroll.offset * 5);
    const progress = (scroll.offset * 5) % 1;

    switch (section) {
      case 0: // Section 1
        gsap.to(ref.current.rotation, { y: 0, duration: 0.5 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 2 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(scene.background, { r: 1, g: 1, b: 1, duration: 0.5 });
        setGlow(false);
        break;
      case 1: // Section 2
        gsap.to(ref.current.rotation, { y: Math.PI / 2, duration: 1.5 });
        gsap.to(ref.current.position, { x: -2, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
        setGlow(false);
        break;
      case 2: // Section 3
        gsap.to(ref.current.rotation, { y: 0, duration: 0.5 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(scene.background, { r: 0, g: 0, b: 0, duration: 0.5 });
        setGlow(true);
        break;
      case 3: // Section 4
        const rotationY = progress * Math.PI * 2;
        const scale = 2 + Math.sin(progress * Math.PI) * 0.5;
        gsap.to(ref.current.rotation, { y: rotationY, duration: 0.1 });
        gsap.to(ref.current.scale, {
          x: scale,
          y: scale,
          z: scale,
          duration: 0.2
        });
        setGlow(true);
        break;
      case 4: // Section 5
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(scene.background, { r: 1, g: 1, b: 1, duration: 0.5 });
        setGlow(false);
        break;
      default:
        break;
    }
  });

  return (
    <group ref={ref}>
      <Axum />
      {glow && (
        <EffectComposer>
          <Bloom
            intensity={1.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.1}
          />
        </EffectComposer>
      )}
    </group>
  );
}

function Experience() {
  return (
    <Canvas camera={{ position: [0, -1.5, 9], fov: 75 }}>
      <color attach="background" args={[1, 1, 1]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ScrollControls pages={5} damping={0.1}>
        <AnimatedAxum />
      </ScrollControls>
    </Canvas>
  );
}

export default Experience;
