import React, { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import Axum from "./axum";

function AnimatedAxum() {
  const ref = useRef();
  const scroll = useScroll();
  const { scene } = useThree();

  useFrame(() => {
    const section = Math.floor(scroll.offset * 5);
    const sectionProgress = (scroll.offset * 5) % 1;

    switch (section) {
      case 0:
        gsap.to(ref.current.rotation, { y: 0, duration: 1 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 1 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 1 });
        gsap.to(scene.background, { r: 0.94, g: 0.94, b: 0.94, duration: 1 });
        break;
      case 1:
        gsap.to(ref.current.rotation, { y: Math.PI / 2, duration: 1 });
        gsap.to(ref.current.position, { x: -2, y: 0, z: 0, duration: 1 });
        gsap.to(ref.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 1 });
        gsap.to(scene.background, { r: 0.88, g: 0.88, b: 0.88, duration: 1 });
        break;
      case 2:
        gsap.to(ref.current.rotation, { y: 0, duration: 1 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 1 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 1 });
        gsap.to(scene.background, { r: 0.82, g: 0.82, b: 0.82, duration: 1 });
        break;
      case 3:
        const rotationProgress = sectionProgress * Math.PI * 2;
        gsap.to(ref.current.rotation, { y: rotationProgress, duration: 0.1 });
        if (sectionProgress < 0.5) {
          gsap.to(ref.current.scale, { x: 0.5, y: 0.5, z: 0.5, duration: 0.5 });
        } else {
          gsap.to(ref.current.scale, { x: 2, y: 2, z: 2, duration: 0.5 });
        }
        gsap.to(scene.background, { r: 0.75, g: 0.75, b: 0.75, duration: 1 });
        break;
      case 4:
        gsap.to(ref.current.rotation, { y: 0, duration: 1 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 1 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 1 });
        gsap.to(scene.background, { r: 0.69, g: 0.69, b: 0.69, duration: 1 });
        break;
    }
  });

  return (
    <group ref={ref}>
      <Axum />
    </group>
  );
}

function Experience() {
  return (
    <Canvas camera={{ position: [0, -2, 9], fov: 75 }}>
      <color attach="background" args={[0.94, 0.94, 0.94]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ScrollControls pages={5} damping={0.1}>
        <AnimatedAxum />
      </ScrollControls>
    </Canvas>
  );
}

export default Experience;
