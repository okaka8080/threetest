import React, { useRef, useState } from "react";
import { Canvas, useFrame} from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Physics, usePlane, useBox } from "@react-three/cannon";

const Controls = (props) => {
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);
  
  const ref = useRef(null);
    
  const color = props.color ? props.color : "hotpink";

  function foward(){
  }

  useFrame(() => {
    const cube = ref.current;
    const velocity = 0.05;
    cube.position.x += 0.01;
  });

  const onKeyDown = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        setMoveForward(true);
        break;

      case "ArrowLeft":
      case "KeyA":
        setMoveLeft(true);
        break;

      case "ArrowDown":
      case "KeyS":
        setMoveBackward(true);
        break;

      case "ArrowRight":
      case "KeyD":
        setMoveRight(true);
        break;

      // case "Space":
      //   if (canJump === true) velocity.y += 350;
      //   canJump = false;
      //   break;
      default:
        return;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case "ArrowUp":
      case "KeyW":
        setMoveForward(false);
        break;

      case "ArrowLeft":
      case "KeyA":
        setMoveLeft(false);
        break;

      case "ArrowDown":
      case "KeyS":
        setMoveBackward(false);
        break;

      case "ArrowRight":
      case "KeyD":
        setMoveRight(false);
        break;

      default:
        return;
    }
  };

  document.addEventListener("keydown", onKeyDown);
  document.addEventListener("keyup", onKeyUp);

  return (
    <mesh receiveShadow castShadow ref={ref}>
    <boxBufferGeometry />
    <meshLambertMaterial attach="material" color={color} />
  </mesh>
  );
};

export default Controls;
