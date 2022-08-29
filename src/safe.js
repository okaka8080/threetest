import React from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import "./App.css";
import Controls from "./Controls";
import Player from "./Player";
import {Background} from "./SphereBackground";

function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1009, 1000]} />
      <shadowMaterial attach="material" color="#171717" />
    </mesh>
  );
}

function Cube(props) {
  const [ref] = useBox(() => ({
    mass: 1,
    position: [0, 5, 0],
    rotation: [0.4, 0.2, 0.5],
    ...props
  }));

  const color = props.color ? props.color : "hotpink";
  return (
    <mesh receiveShadow castShadow ref={ref}>
      <sphereBufferGeometry/>
      <meshLambertMaterial attach="material" color={color} />
    </mesh>
  );
}



function App() {
  return (
    <Canvas
      shadowMap
      sRGB
      gl={{ alpha: false }}
      camera={{ position: [-1, 1, 5], fov: 50 }}
    >
      <color attach="background" args={["lightblue"]} />
      <Physics>
        <Controls />
        <hemisphereLight intensity={0.35} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
        />
        <Plane />
        <Cube geometry={[0.1, 0.1, 0.1]}/>
        <Cube position={[0, 10, -2]} color="rebeccapurple" />
        <Cube position={[0, 20, -2]} color="darkseagreen" />
      </Physics>
    </Canvas>
  );
}

export default App;