import React, { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import StarField from "./StarField";

function Sun() {
  const texture = useTexture("/textures/sun.jpg");

  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial 
      map={texture}
      emissive={0xffff00}
      emissiveMap={texture} 
      emissiveIntensity={2}
      roughness={0.1}
      metalness={0.5}
      />
    </mesh>
  );
}

function Planet({ radius, size, name, onClick, speed, texturePath }) {
  const planetRef = useRef();
  const texture = useTexture(texturePath);

  // Rotate the planet around the sun
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime() * speed; // Slow down the rotation
    planetRef.current.position.x = Math.cos(time) * radius;
    planetRef.current.position.z = Math.sin(time) * radius;
  });

  return (
    <mesh
      ref={planetRef}
      onClick={onClick}
      scale={[size, size, size]}
      position={[radius, 0, 0]}
    >
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function DynamicCamera({ targetPosition }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.lerp(
      { x: targetPosition[0], y: targetPosition[1], z: targetPosition[2] },
      0.1
    ); // Smooth transition
    camera.lookAt(0, 0, 0); // Focus on the Sun
  });

  return null;
}


//main portfolio component

export default function Portfolio() {
  const [cameraTarget, setCameraTarget] = useState([0, 10, 20]);

  return (
    <>
      <Canvas style={{ height: "100vh", background: "black"
        }} gl={{ alpha: true}} >
        <DynamicCamera targetPosition={cameraTarget} />
        <ambientLight intensity={0.5} />
        <pointLight position={[0, 0, 0]} intensity={2} />
        <StarField />

        {/* Solar System */}
        <Sun />
        <Planet
          radius={5}
          size={0.5}
          texturePath="/textures/ceres.jpg"
          speed={0.2}
        />
        <Planet
          radius={8}
          size={0.7}
          texturePath="/textures/eris.jpg"
          speed={0.15}
        />
        <Planet
          radius={11}
          size={0.6}
          texturePath="/textures/mars.jpg"
          speed={0.1}
        />
        <Planet
          radius={14}
          size={0.8}
          texturePath="/textures/makemake.jpg"
          speed={0.18}
        />
        <Planet
          radius={17}
          size={0.9}
          texturePath="/textures/neptune.jpg"
          speed={0.12}
        />
        <OrbitControls />
      </Canvas>
    </>
  );
}
