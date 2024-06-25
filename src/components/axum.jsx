import React, { useRef, useMemo } from "react";
import { useGLTF } from "@react-three/drei";

function Axum({ material }) {
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

export default React.memo(Axum);
