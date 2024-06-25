import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useScroll } from "@react-three/drei";
import gsap from "gsap";
import Axum from "./axum";
import FakeGlowMaterial from "./glowMaterial";
function AnimatedAxum() {
  const ref = useRef();
  const scroll = useScroll();
  const { scene } = useThree();
  const [originalMaterial, setOriginalMaterial] = useState(null);
  const [glowMaterial, setGlowMaterial] = useState(null);

  useEffect(() => {
    const newGlowMaterial = FakeGlowMaterial({
      glowColor: "#00ff00",
      falloff: 0.1,
      glowInternalRadius: 6.0,
      glowSharpness: 1.0,
      opacity: 1.0
    });
    setGlowMaterial(newGlowMaterial);
  }, []);

  useFrame((state) => {
    const section = Math.floor(scroll.offset * 5);
    const progress = (scroll.offset * 5) % 1;

    switch (section) {
      case 0: // Section 1
        gsap.to(ref.current.rotation, { y: 0, duration: 0.5 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(scene.background, { r: 1, g: 1, b: 1, duration: 0.5 });
        break;
      case 1: // Section 2
        gsap.to(ref.current.rotation, { y: Math.PI / 2, duration: 0.5 });
        gsap.to(ref.current.position, { x: -2, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
        break;
      case 2: // Section 3
        gsap.to(ref.current.rotation, { y: 0, duration: 0.5 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(scene.background, { r: 0, g: 0, b: 0, duration: 0.5 });
        if (ref.current.children[0] && glowMaterial) {
          if (!originalMaterial) {
            setOriginalMaterial(ref.current.children[0].material);
          }
          ref.current.children[0].material = glowMaterial;
        }
        break;
      case 3: // Section 4
        const rotationY = progress * Math.PI * 2;
        const scale = 1 + Math.sin(progress * Math.PI) * 0.5;
        gsap.to(ref.current.rotation, { y: rotationY, duration: 0.1 });
        gsap.to(ref.current.scale, {
          x: scale,
          y: scale,
          z: scale,
          duration: 0.1
        });
        break;
      case 4: // Section 5
        gsap.to(ref.current.rotation, { y: 0, duration: 0.5 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(scene.background, { r: 1, g: 1, b: 1, duration: 0.5 });
        if (ref.current.children[0] && originalMaterial) {
          ref.current.children[0].material = originalMaterial;
        }
        break;
      default:
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
