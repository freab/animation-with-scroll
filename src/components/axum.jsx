import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

function Axum() {
  const group = useRef();
  const { nodes, materials } = useGLTF("/axum.glb");

  useFrame((state, delta) => {});

  return (
    <group ref={group} className="model" position={[0, -1.5, 0]}>
      <mesh
        geometry={nodes.The_Obelisk_Of_Axum.geometry}
        material={nodes.The_Obelisk_Of_Axum.material}
        scale={[1, 1, 1]}
      />
    </group>
  );
}

useGLTF.preload("/axum.glb");

export default Axum;
