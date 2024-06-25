import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScrollControls, useScroll, useGLTF } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration
} from "@react-three/postprocessing";
import { Color, Vector2 } from "three";
import { animate } from "framer-motion";
import { easeQuadOut } from "d3-ease";
import gsap from "gsap";

import { noise } from "./Noise";
import { useStore } from "./Store";
import { colors } from "./data";

function Axum({ emissiveIntensity = 1, material }) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/axum.glb");

  const [current, setCurrent] = useState(0);
  const play = useStore((s) => s.play);
  const setPlay = useStore((s) => s.setPlay);

  const uniforms = useMemo(
    () => ({
      u_time: { value: 0 },
      u_color1: { value: new Color(colors[0]) },
      u_color2: { value: new Color(colors[1]) },
      u_progress: { value: 0.5 },
      u_width: { value: 0.8 },
      u_scaleX: { value: 50 },
      u_scaleY: { value: 50 },
      u_textureSize: {
        value: new Vector2(
          materials["The_Obelisk_Of_Axum"].map.source.data.width,
          materials["The_Obelisk_Of_Axum"].map.source.data.height
        )
      },
      u_emissiveIntensity: { value: emissiveIntensity }
    }),
    [colors, materials, emissiveIntensity]
  );

  const handleClick = () => {
    let len = colors.length;
    let nextTexture = new Color(colors[(current + 1) % len]);
    uniforms.u_color2.value = nextTexture;

    if (play) {
      animate(0.5, 1, {
        onUpdate(v) {
          setPlay(false);
          uniforms.u_progress.value = v;
        },
        onComplete() {
          setCurrent((current + 1) % len);

          uniforms.u_color1.value = nextTexture;
          uniforms.u_progress.value = 0.5;
          setPlay(true);
        },
        duration: 1,
        ease: easeQuadOut
      });
    }
  };

  useEffect(() => {
    materials["The_Obelisk_Of_Axum"].metalness = 0;
    materials["The_Obelisk_Of_Axum"].roughness = 1;
    materials["The_Obelisk_Of_Axum"].onBeforeCompile = (shader) => {
      shader.uniforms = Object.assign(shader.uniforms, uniforms);
      shader.vertexShader = shader.vertexShader.replace(
        `#include <common>`,
        `
          #include <common>
          varying vec2 vUv;
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
          #include <begin_vertex>
          vUv = uv;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <common>`,
        `
          #include <common>
          uniform float u_time;
          uniform vec3 u_color1;
          uniform vec3 u_color2;
          uniform float u_progress;
          uniform float u_width;
          uniform float u_scaleX;
          uniform float u_scaleY;
          uniform vec2 u_textureSize;
          uniform float u_emissiveIntensity;
          varying vec2 vUv;
          ${noise}
          float parabola( float x, float k ) {
            return pow( 4. * x * ( 1. - x ), k );
          }
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        `#include <color_fragment>`,
        `
          #include <color_fragment>
          float aspect = u_textureSize.x/u_textureSize.y;
          float dt = parabola(u_progress,1.);
          float border = 1.;
          float noise = 0.5*(cnoise(vec4(vUv.x*u_scaleX  + 0.5*u_time/3., vUv.y*u_scaleY,0.5*u_time/3.,0.)) + 1.);
          float w = u_width*dt;
          float maskValue = smoothstep(1. - w,1.,vUv.y + mix(-w/2., 1. - w/2., u_progress));
          maskValue += maskValue * noise;
          float mask = smoothstep(border,border+0.01,maskValue);
          vec3 finalColor = mix(u_color1, u_color2, mask);
          diffuseColor.rgb = mix(diffuseColor.rgb, finalColor, u_emissiveIntensity);
        `
      );
    };
  }, [uniforms, materials]);

  return (
    <group ref={group} position={[0, -1.5, 0]} onClick={handleClick}>
      <mesh
        geometry={nodes.The_Obelisk_Of_Axum.geometry}
        material={material || materials["The_Obelisk_Of_Axum"]}
      />
    </group>
  );
}

function AnimatedAxum() {
  const ref = useRef();
  const scroll = useScroll();
  const { scene } = useThree();
  const [emissiveIntensity, setEmissiveIntensity] = useState(1);
  const [postprocessingSettings, setPostprocessingSettings] = useState({
    bloom1Intensity: 0,
    bloom2Intensity: 0,
    chromaticAberrationOffset: [0, 0],
    vignetteDarkness: 0
  });

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const section = Math.floor(scroll.offset * 5);
    const progress = (scroll.offset * 5) % 1;

    // Global emissive intensity increase
    const baseEmissiveIntensity = 1 + scroll.offset * 2; // Increases from 1 to 3 as you scroll
    setEmissiveIntensity(baseEmissiveIntensity);

    ref.current.position.y = Math.sin(time) * 0.12;

    switch (section) {
      case 0: // Section 1
        gsap.to(ref.current.rotation, { y: 0, duration: 0.5 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(scene.background, { r: 0.9, g: 0.9, b: 0.9, duration: 0.5 });
        setPostprocessingSettings({
          bloom1Intensity: 0,
          bloom2Intensity: 0,
          chromaticAberrationOffset: [0, 0],
          vignetteDarkness: 0
        });
        break;
      case 1: // Section 2
        gsap.to(ref.current.rotation, { y: Math.PI / 2, duration: 0.5 });
        gsap.to(ref.current.position, { x: -2, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1.5, y: 1.5, z: 1.5, duration: 0.5 });
        setPostprocessingSettings({
          bloom1Intensity: 0.3,
          bloom2Intensity: 0,
          chromaticAberrationOffset: [0.002, 0.002],
          vignetteDarkness: 0.5
        });
        break;
      case 2: // Section 3
        gsap.to(ref.current.rotation, { y: 0, duration: 0.5 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(scene.background, { r: 0.1, g: 0.1, b: 0.1, duration: 0.5 });
        setPostprocessingSettings({
          bloom1Intensity: 0.5,
          bloom2Intensity: 1.0,
          chromaticAberrationOffset: [0.005, 0.005],
          vignetteDarkness: 0.7
        });
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
        setPostprocessingSettings({
          bloom1Intensity: 0.5,
          bloom2Intensity: 1.0 + Math.sin(progress * Math.PI) * 0.5,
          chromaticAberrationOffset: [
            0.007 + Math.sin(progress * Math.PI) * 0.003,
            0.007 + Math.sin(progress * Math.PI) * 0.003
          ],
          vignetteDarkness: 0.8
        });
        // Additional emissive intensity boost for section 4
        setEmissiveIntensity(
          baseEmissiveIntensity * (1 + Math.sin(progress * Math.PI) * 0.5)
        );
        break;
      case 4: // Section 5
        gsap.to(ref.current.rotation, { y: 0, duration: 0.5 });
        gsap.to(ref.current.position, { x: 0, y: 0, z: 0, duration: 0.5 });
        gsap.to(ref.current.scale, { x: 1, y: 1, z: 1, duration: 0.5 });
        gsap.to(scene.background, { r: 0.9, g: 0.9, b: 0.9, duration: 0.5 });
        setPostprocessingSettings({
          bloom1Intensity: 0,
          bloom2Intensity: 0,
          chromaticAberrationOffset: [0, 0],
          vignetteDarkness: 0
        });
        break;
      default:
        break;
    }
  });
  return (
    <>
      <group ref={ref}>
        <Axum
          emissiveIntensity={emissiveIntensity}
          onClick={() => handleClick()}
        />
      </group>
      <EffectComposer>
        <Bloom
          intensity={postprocessingSettings.bloom1Intensity}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
          radius={1}
        />
        <Bloom
          intensity={postprocessingSettings.bloom2Intensity}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
          height={300}
          radius={0.4}
        />
        <ChromaticAberration
          offset={postprocessingSettings.chromaticAberrationOffset}
        />
        <Vignette
          eskil={false}
          offset={0.1}
          darkness={postprocessingSettings.vignetteDarkness}
        />
      </EffectComposer>
    </>
  );
}

function Experience() {
  return (
    <Canvas camera={{ position: [0, -1.5, 9], fov: 75 }}>
      <color attach="background" args={[0.9, 0.9, 0.9]} />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <ScrollControls pages={5} damping={0.1}>
        <AnimatedAxum />
      </ScrollControls>
    </Canvas>
  );
}

export default Experience;
