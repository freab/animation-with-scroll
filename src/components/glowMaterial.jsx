// In glowMaterial.jsx
import {
  Color,
  DoubleSide,
  AdditiveBlending,
  FrontSide,
  BackSide,
  ShaderMaterial
} from "three";

const FakeGlowMaterial = ({
  falloff = 0.5,
  glowInternalRadius = 2.0,
  glowColor = "#00ff00",
  glowSharpness = 4.0,
  side = "THREE.FrontSide",
  depthTest = false,
  opacity = 1.0
}) => {
  const material = new ShaderMaterial({
    uniforms: {
      falloffAmount: { value: falloff },
      glowInternalRadius: { value: glowInternalRadius },
      glowColor: { value: new Color(glowColor) },
      glowSharpness: { value: glowSharpness },
      opacity: { value: opacity }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vNormal = normalize(normalMatrix * normal);
        vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      uniform float falloffAmount;
      uniform float glowSharpness;
      uniform float glowInternalRadius;
      uniform float opacity;

      varying vec3 vNormal;
      varying vec3 vWorldPosition;

      void main() {
        vec3 worldCameraPosition = cameraPosition;
        vec3 viewDirection = normalize(worldCameraPosition - vWorldPosition);
        float fresnel = dot(viewDirection, vNormal);
        fresnel = pow(1.0 - fresnel, glowInternalRadius);
        float glow = 1.0 - pow(fresnel, glowSharpness);
        glow = smoothstep(0.0, falloffAmount, glow);
        gl_FragColor = vec4(glowColor, glow * opacity);
      }
    `
  });

  material.side =
    side === "THREE.DoubleSide"
      ? DoubleSide
      : side === "THREE.BackSide"
      ? BackSide
      : FrontSide;
  material.transparent = true;
  material.blending = AdditiveBlending;
  material.depthWrite = false;
  material.depthTest = depthTest;

  return material;
};

export default FakeGlowMaterial;
