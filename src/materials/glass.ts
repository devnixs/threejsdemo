import * as THREE from "three";

export const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
  transmission: 1, // Make the material transparent
  thickness: 0, // Set the thickness of the glass
  clearcoat: 0,
  clearcoatRoughness: 0,
  reflectivity: 1,
  ior: 1.5, // Index of Refraction (default is 1.5 for glass)
});