import * as THREE from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { makeBoxInstance, makeBoxInstanceV2 } from "./makeInstance";

const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 5;

const size = 5;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions);
const axesHelper = new THREE.AxesHelper(3);
const color = 0xffffff;
const intensity = 1;
const light = new THREE.AmbientLight(color, intensity);

const scene = new THREE.Scene();
scene.add(gridHelper);
scene.add(axesHelper);
scene.add(light);

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

const planeGeometry = new THREE.PlaneGeometry(5, 5);

/**
 * TODO #1: SceneObjects must be an array of objects with instance and name.
 * For instance, `const names = [{ name, object }]` already looks right, you just need to
 * change from object: sceneObjects to a makeInstance function.
 */
const sceneObjects = [
  makeBoxInstanceV2(
    //geladeira
    {
      color: 0x0000ff,
      position: { x: -1, y: 1, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      size: { x: 1, y: 2, z: 1 },
    }
  ),

  makeBoxInstanceV2(
    // cubo invertido
    {
      color: 0xffa500,
      position: { x: 0.9, y: 1.75, z: -0.05 },
      rotation: { x: 0, y: 0, z: 0 },
      size: { x: 5, y: 3.5, z: 5 },
      side: THREE.BackSide,
    }
  ),

  makeBoxInstanceV2(
    //pia
    {
      color: 0x800080,
      position: { x: 1.9, y: 0.5, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      size: { x: 2.6, y: 1, z: 1 },
    }
  ),

  makeBoxInstanceV2(
    //armario
    {
      color: 0x800080,
      position: { x: -1, y: 0.8, z: 1.4 },
      rotation: { x: 0, y: (90 * Math.PI) / 180, z: 0 },
      size: { x: 2, y: 1.5, z: 1 },
    }
  ),
  makeBoxInstanceV2(
    //cooktop
    {
      color: 0x00ff00,
      position: { x: 0, y: 0.5, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      size: { x: 1, y: 1, z: 1 },
    }
  ),
];

const names = [
  { name: "freezer", object: sceneObjects[0] },
  { name: "walls", object: sceneObjects[1] },
  { name: "sink", object: sceneObjects[2] },
  { name: "chinaCabinet", object: sceneObjects[3] },
  { name: "cooktop", object: sceneObjects[4] },
];

/** After TODO #1 you need to make sure scene.add is using the right property path */
sceneObjects.forEach((obj) => scene.add(obj.cube));

function PickHelper() {
  const raycaster = new THREE.Raycaster();
  let pickedObject = null;

  this.pick = (normalizedPosition, scene, camera) => {
    raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = raycaster.intersectObjects(scene.children, true);
    /** TODO #2 [SPIKE/STUDY]
     * Confirm if raycaster.intersectedObjects returns objects in a ordered way.
     * Basically, if the first object returned is the closest and the last object (array item) is the
     * non-picked or maybe the last in hierarchy.
     */

    /**
     * TODO #3
     * Instead of picking the first object,
     * loop through the list of possible picked objects, and
     * show their names.
     * Additional: Try to show their positions on the scene.
     * Tips:
     *  - Use Array.prototype.map(lambda)
     */
    if (intersectedObjects.length > 0) {
      pickedObject = intersectedObjects[0].object;
    }

    const found = names.find((item) => item.object.cube === pickedObject);

    if (found) {
      console.log("Objeto selecionado", found.name);
    } else {
      console.log("Objeto selecionado não tem um nome associado.");
    }

    /**
     * TODO #5
     * Shows object names in view, not using console.log.
     * Tips:
     *  - Use a simple <p> tag to show the text.
     *  - HTMLElement.prototype.innerText
     *  - Identify <p> tag with #id pick-objects-names
     *  - document.querySelector('#pick-objects-names')
     *  - Use Array.prototype.join(lambda) to convert a array into a string
     */
  };
}

const pickHelper = new PickHelper();

const pickPosition = { x: 0, y: 0 };

clearPickPosition();

function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) * canvas.width) / rect.width,
    y: ((event.clientY - rect.top) * canvas.height) / rect.height,
  };
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width) * 2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;
}

function clearPickPosition() {
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

/**
 * TODO #4
 * Show an Toggle Button at UI that should define if you want to see
 * objects based on their click or by hovering them.
 * If Toggle is Active, use HOVER.
 * If Toggle is not Active, use CLICK.
 * Every time the Toggle changes, you should exchange event listeners.
 * Tips:
 *  - window.removeEventListener
 *  - create a toggle using a simple button in HTML
 *  - add event listener to the button which executes the toggle of events
 *
 * This should happen so the user can choose if it wants to see
 * objects names based on clicks or hovers.
 */
window.addEventListener("click", setPickPosition);

canvas.addEventListener("mouseout", clearPickPosition);

function render() {
  checkResizeRendererToDisplaySize(renderer);
  pickHelper.pick(pickPosition, scene, camera);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
  controls.update();
}

function checkResizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  return needResize;
}

requestAnimationFrame(render);

// Adiciona um listener para redimensionamento
window.addEventListener(
  "resize",
  () => {
    checkResizeRendererToDisplaySize(renderer);
  },
  false
);
