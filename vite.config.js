import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import glsl from "vite-plugin-glsl";
import gltf from "vite-plugin-gltf";
import { textureResize } from "@gltf-transform/functions";

export default defineConfig({
  plugins: [
    react(),
    glsl(),
    gltf({
      transforms: [textureResize({ size: [1024, 1024] })]
    })
  ],
  assetsInclude: ["**/*.gltf", "**/*.glb"]
});
