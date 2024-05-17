import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";
import { CabinDefinition } from "./cabin";

export function buildGui(cabin : CabinDefinition) {
    const gui = new GUI();

    const params = {
      openDoor: false,
    };

    gui
      .add(params, "openDoor")
      .name("Porte ouverte")
      .onChange((value) => {
        if (value) {
          cabin.animateLeft();
        } else {
          cabin.animateRight();
        }
      });

    return gui;
};