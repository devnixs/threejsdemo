import * as TWEEN from "@tweenjs/tween.js"; // Import the TWEEN library
import * as THREE from "three";
import { TextureLoader } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CabinDefinition, loadCabinObject } from "./objects/cabin";
import { buildGui } from "./objects/gui";
import imageUrl from "../public/images/everest.jpg";

class CabinScene {
  private _scene = new THREE.Scene();
  private _camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  private _renderer = new THREE.WebGLRenderer();
  private _controls = new OrbitControls(this._camera, this._renderer.domElement);
  private _cabin: CabinDefinition | null = null;
  private _raycaster = new THREE.Raycaster();
  private _intersected: THREE.Mesh | null = null;
  private _previousMaterial: THREE.Material | null = null;

  constructor() {}

  public addEventListeners() {
    // Handle window resize
    window.addEventListener("resize", () => {
      this._camera.aspect = window.innerWidth / window.innerHeight;
      this._camera.updateProjectionMatrix();
      this._renderer.setSize(window.innerWidth, window.innerHeight);
    });

    document.addEventListener("mousemove", (event) => this.onDocumentMouseMove(event));
  }

  async animate() {
    requestAnimationFrame(() => this.animate());
    this._controls.update();
    TWEEN.update();
    this._renderer.render(this._scene, this._camera);
  }

  async buildScene() {
    this._camera.position.z = 5.5;
    this._camera.position.x = 4.5;
    this._camera.position.y = 1.2;

    this._renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this._renderer.domElement);

    this._cabin = await loadCabinObject();

    this._scene.add(this._cabin.object.scene);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2); // soft white light
    this._scene.add(ambientLight);

    const light2 = new THREE.PointLight(0xffffff, 300)
    light2.position.set(-3, 8, 5)
    light2.castShadow = true
    light2.shadow.mapSize.width = 1024
    light2.shadow.mapSize.height = 1024
    light2.shadow.camera.near = 0.1
    light2.shadow.camera.far = 30
    light2.shadow.bias = -0.01;
    this._scene.add(light2)


    const textureLoader = new TextureLoader();
    textureLoader.load(imageUrl, (texture) => {
      this._scene.background = texture;
    });


    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = THREE.PCFSoftShadowMap

    buildGui(this._cabin);
  }

  onDocumentMouseMove(event: MouseEvent) {
    event.preventDefault();

    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    this._raycaster.setFromCamera(mouse, this._camera);
    const intersects = this._raycaster.intersectObjects(this._cabin!.object.scene.children, true);

    if(this._previousMaterial !== null && this._intersected !== null && (intersects.length === 0 || intersects[0].object !== this._intersected)) {
      this._intersected.material = this._previousMaterial;
      this._previousMaterial = null;
      this._intersected = null;
    }

    if (intersects.length > 0 && this._intersected !== intersects[0].object) {
      console.log("intersected", intersects[0].object);
      // set cursor to pointer
      document.body.style.cursor = "pointer";

      this._intersected = intersects[0].object as THREE.Mesh;
      // this._previousMaterial = this._intersected.material as THREE.Material;
      // this._intersected.material = new THREE.MeshPhongMaterial( { 
      //   color: 0x999999,
      //   shininess: 0.8,
      //   reflectivity: 0.8,
      // });
    } else if(intersects.length > 0) {
      // set cursor to pointer
      document.body.style.cursor = "pointer";
    }else{
      document.body.style.cursor = "default";
    }
  }
}

var cabinScene = new CabinScene();
cabinScene.buildScene();
cabinScene.animate();
cabinScene.addEventListeners();
