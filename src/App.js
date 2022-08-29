import React from "react";
import { useRef, Suspense ,useLayoutEffect, useMemo, useEffect} from 'react'
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics, usePlane, useBox , useSphere} from "@react-three/cannon";
import "./App.css";
import Controls from "./Controls";
import Player from "./Player";
import { MathUtils } from 'three'
import * as THREE from "three"
import { Instances, Instance, Environment, ContactShadows } from '@react-three/drei'
import { EffectComposer, SSAO } from '@react-three/postprocessing'
import niceColors from "nice-color-palettes"
import Grass from "./Grass"

const tempColor = new THREE.Color()
const data = Array.from({ length: 1000 }, () => ({ color: niceColors[Math.floor(Math.random() * 100)][Math.floor(Math.random() * 5)], scale: 1 }))


function Plane(props) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1009, 1000]} />
      <shadowMaterial attach="material" color="#171717" />
    </mesh>
  );
}

function Sphere(props) {
  const [ref] = useSphere(() => ({
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
//test
const particles = Array.from({ length: 150 }, () => ({
  factor: MathUtils.randInt(20, 100),
  speed: MathUtils.randFloat(0.01, 1),
  xFactor: MathUtils.randFloatSpread(80),
  yFactor: MathUtils.randFloatSpread(40),
  zFactor: MathUtils.randFloatSpread(40),
}))

function Bubbles() {
  const ref = useRef()
  const colorArray = useMemo(() => Float32Array.from(new Array(1000).fill().flatMap((_, i) => tempColor.set(data[i].color).toArray())), [])
  var colors = require('nice-color-palettes');
  console.log(colors)
  useFrame((state, delta) => void (ref.current.rotation.y = MathUtils.damp(ref.current.rotation.y, (-state.mouse.x * Math.PI) / 6, 2.75, delta)))
  return (
    <Instances limit={particles.length} ref={ref} castShadow receiveShadow position={[0, 10, 0]}>
      <sphereGeometry args={[1, 32, 32]} >
        <instancedBufferAttribute attach="attributes-color" args={[colorArray, 3]} />
      </sphereGeometry>
      <meshStandardMaterial roughness={0} toneMapped={false} vertexColors/>
      {particles.map((data, i) => (
        <Bubble key={i} {...data} />
      ))}
    </Instances>
  )
}


function Bubble({ factor, speed, xFactor, yFactor, zFactor }) {
  const ref = useRef()
  useFrame((state) => {
    const t = factor + state.clock.elapsedTime * (speed / 2)
    ref.current.scale.setScalar(Math.max(1.5, Math.cos(t) * 5))
    ref.current.position.set(
      Math.cos(t) + Math.sin(t * 1) / 10 + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
      Math.sin(t) + Math.cos(t * 2) / 10 + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
      Math.sin(t) + Math.cos(t * 2) / 10 + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
    )
  })
  return <Instance ref={ref} />
}

//


//
function App() {
  return (
    <Canvas
    shadowMap
    sRGB
      gl={{ antialias: false }}
      camera={{ position: [-1, 1, 5], fov: 50 }}
    >
      <color attach="background" args={["#f0f0f0"]} />
      <fog attach="fog" args={['white', 60, 110]} />
      <ambientLight intensity={1} />
      <pointLight position={[100, 10, -50]} intensity={1} castShadow />
      <pointLight position={[-100, -100, -100]} intensity={1} color="red" />
      <Bubbles />
      <ContactShadows position={[0, -30, 0]} opacity={0.6} scale={130} blur={1} far={40} />
      <EffectComposer multisampling={0}>
        <SSAO samples={31} radius={0.1} intensity={30} luminanceInfluence={0.1} color="red" />
      </EffectComposer>
      <Suspense fallback={null}>
        <Environment preset="city" />
      </Suspense>
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
        <Sphere geometry={[0.1, 0.1, 0.1]}/>
        <Sphere position={[0, 10, -2]} color="rebeccapurple" />
        <Sphere position={[0, 20, -2]} color="darkseagreen" />
      </Physics>
    </Canvas>
  );
}

export default App;
