import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function Bottle() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.15;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group ref={groupRef} scale={1.2}>
        {/* Main bottle body */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.45, 0.5, 2.8, 32, 1]} />
          <meshStandardMaterial
            color="#3a3632"
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>

        {/* Bottle neck */}
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.2, 0.35, 0.8, 32, 1]} />
          <meshStandardMaterial
            color="#3a3632"
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>

        {/* Cap */}
        <mesh position={[0, 2.4, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.4, 32, 1]} />
          <meshStandardMaterial
            color="#2a2725"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Bottom ring detail */}
        <mesh position={[0, -1.35, 0]}>
          <torusGeometry args={[0.48, 0.03, 16, 32]} />
          <meshStandardMaterial
            color="#4a4540"
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Mid-body accent ring */}
        <mesh position={[0, 0.3, 0]}>
          <torusGeometry args={[0.46, 0.015, 16, 32]} />
          <meshStandardMaterial
            color="#5a554f"
            metalness={0.95}
            roughness={0.05}
          />
        </mesh>

        {/* Glass/transparent section at top */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.42, 0.44, 0.4, 32, 1]} />
          <MeshTransmissionMaterial
            backside
            samples={6}
            thickness={0.3}
            chromaticAberration={0.02}
            anisotropy={0.3}
            distortion={0.0}
            distortionScale={0.0}
            temporalDistortion={0.0}
            ior={1.5}
            color="#8a857f"
            roughness={0.1}
          />
        </mesh>
      </group>
    </Float>
  );
}

const BottleModel = () => {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6], fov: 35 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} color="#c4b8a8" />
      <spotLight
        position={[0, 8, 0]}
        intensity={0.6}
        angle={0.3}
        penumbra={0.8}
        color="#f5efe6"
      />
      <Bottle />
      <Environment preset="studio" />
    </Canvas>
  );
};

export default BottleModel;
