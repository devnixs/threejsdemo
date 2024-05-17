import { glassMaterial } from "../materials/glass";
import { loadModel } from "../utils/model-loader";
import * as TWEEN from "@tweenjs/tween.js"; // Import the TWEEN library
import * as THREE from "three";

export const loadCabinObject = async () => {
  const cabin = await loadModel("models/cabin/scene2.glb");

  cabin.scene.position.set(0, -3.5, 0);
  cabin.scene.scale.set(0.8, 0.8, 0.8);

  let door: THREE.Mesh = cabin.scene.getObjectByName("Porte") as THREE.Mesh;

  cabin.scene.traverse((child) => {
    if (child.name.indexOf("Subtle_Reflections") > -1 && child instanceof THREE.Mesh) {
      child.material = glassMaterial;
    }else if (child instanceof THREE.Mesh) {
        // set the material to cast shadows
        child.castShadow = true;
        child.receiveShadow = true
    }
  });

  let activeAnimations: TWEEN.Tween<THREE.Vector3>[] = [];
  const startPosition = door.position.clone();
  const endPosition = door.position.clone().add(new THREE.Vector3(-100, 0, 0));

  return {
    object: cabin,
    animateLeft: () => {
      if (activeAnimations.length > 0) {
        activeAnimations.forEach((animation) => {
          animation.stop();
        });
        activeAnimations = [];
      }

      const doorOpening = new TWEEN.Tween(door.position)
        .to(endPosition, 1000) // 2000 milliseconds = 2 seconds
        .easing(TWEEN.Easing.Quadratic.InOut) // Use any easing function
        .start();
      activeAnimations.push(doorOpening);
    },
    animateRight: () => {
      if (activeAnimations.length > 0) {
        activeAnimations.forEach((animation) => {
          animation.stop();
        });
        activeAnimations = [];
      }

      const doorClosing = new TWEEN.Tween(door.position)
        .to(startPosition, 1000) // 2000 milliseconds = 2 seconds
        .easing(TWEEN.Easing.Quadratic.InOut) // Use any easing function
        .start();
      activeAnimations.push(doorClosing);
    },
  };
};

export type CabinDefinition = Awaited<ReturnType<typeof loadCabinObject>>;