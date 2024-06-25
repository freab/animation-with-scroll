import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback
} from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useScroll } from "@react-three/drei";
import gsap from "gsap";
import Axum from "./axum";
import FakeGlowMaterial from "./glowMaterial";

function AnimatedAxum() {
  const ref = useRef();
  const scroll = useScroll();
  const { scene } = useThree();
  const [originalMaterial, setOriginalMaterial] = useState(null);
  const glowMaterial = useMemo(
    () =>
      FakeGlowMaterial({
        glowColor: "#00ff00",
        falloff: 0.1,
        glowInternalRadius: 6.0,
        glowSharpness: 1.0,
        opacity: 1.0
      }),
    []
  );

  useEffect(() => {
    if (ref.current) {
      setOriginalMaterial(ref.current.children[0].material);
    }
  }, []);

  const handleMaterialChange = useCallback(
    (useGlow) => {
      if (ref.current && ref.current.children[0]) {
        ref.current.children[0].material = useGlow
          ? glowMaterial
          : originalMaterial;
      }
    },
    [glowMaterial, originalMaterial]
  );

  useFrame(() => {
    const section = Math.floor(scroll.offset * 5);
    const progress = (scroll.offset * 5) % 1;

    if (ref.current) {
      switch (section) {
        case 0: // Section 1
          gsap.to(ref.current.rotation, {
            y: 0,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(ref.current.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(ref.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(scene.background, {
            r: 1,
            g: 1,
            b: 1,
            duration: 0.5,
            ease: "power2.out"
          });
          handleMaterialChange(false);
          break;
        case 1: // Section 2
          gsap.to(ref.current.rotation, {
            y: Math.PI / 2,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(ref.current.position, {
            x: -2,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(ref.current.scale, {
            x: 1.5,
            y: 1.5,
            z: 1.5,
            duration: 0.5,
            ease: "power2.out"
          });
          handleMaterialChange(false);
          break;
        case 2: // Section 3
          gsap.to(ref.current.rotation, {
            y: 0,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(ref.current.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(ref.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(scene.background, {
            r: 0,
            g: 0,
            b: 0,
            duration: 0.5,
            ease: "power2.out"
          });
          handleMaterialChange(true);
          break;
        case 3: // Section 4
          gsap.to(ref.current.rotation, {
            y: progress * Math.PI * 2,
            duration: 0.1,
            ease: "power2.out"
          });
          const scale = 1 + Math.sin(progress * Math.PI) * 0.5;
          gsap.to(ref.current.scale, {
            x: scale,
            y: scale,
            z: scale,
            duration: 0.1,
            ease: "power2.out"
          });
          handleMaterialChange(true);
          break;
        case 4: // Section 5
          gsap.to(ref.current.rotation, {
            y: 0,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(ref.current.position, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(ref.current.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: "power2.out"
          });
          gsap.to(scene.background, {
            r: 1,
            g: 1,
            b: 1,
            duration: 0.5,
            ease: "power2.out"
          });
          handleMaterialChange(false);
          break;
        default:
          break;
      }
    }
  });

  return (
    <group ref={ref}>
      <Axum />
    </group>
  );
}

export default React.memo(AnimatedAxum);
