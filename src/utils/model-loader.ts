import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export async function loadModel(path: string): Promise<GLTF> {
  return new Promise((resolve) => {
    const loader = new GLTFLoader();
    loader.load(path, (model : GLTF) => {
      resolve(model);
    });
  });
}


