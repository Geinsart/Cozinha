import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { makeBoxInstance, makeBoxInstanceV2 } from "./makeInstance";

/**
 * #TODO 01
 * Split index.js into many files by domain:
 *  - core_scene_control (pespectivecamera, gridhelpers, ambientlight, etc)
 *  - scene_objects
 *  - ui_display (dbclick or hover event)
 *  - scene_events
 *  - scene_helpers
 * Next step (for next sessions): TypeScript
 */

const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(1, 1, 2);

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
planeGeometry.name = "background";

const sceneObjects = [
  {
    name: "freezer",
    object: makeBoxInstanceV2({
      name: "freezer",
      color: 0x0000ff,
      position: { x: -1, y: 1, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      size: { x: 1, y: 2, z: 1 },
    }),
  },

  {
    name: "walls",
    object: makeBoxInstanceV2({
      name: "walls",
      color: 0xffa500,
      position: { x: 0.9, y: 1.75, z: -0.05 },
      rotation: { x: 0, y: 0, z: 0 },
      size: { x: 5, y: 3.5, z: 5 },
      side: THREE.BackSide,
    }),
  },

  {
    name: "sink",
    object: makeBoxInstanceV2({
      name: "sink",
      color: 0x800080,
      position: { x: 1.9, y: 0.5, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      size: { x: 2.6, y: 1, z: 1 },
    }),
  },

  {
    name: "chinaCabinet",
    object: makeBoxInstanceV2({
      name: "chinaCabinet",
      color: 0x800080,
      position: { x: -1, y: 0.8, z: 1.4 },
      rotation: { x: 0, y: (90 * Math.PI) / 180, z: 0 },
      size: { x: 2, y: 1.5, z: 1 },
    }),
  },
  {
    name: "cooktop",
    object: makeBoxInstanceV2({
      name: "cooktop",
      color: 0x00ff00,
      position: { x: 0, y: 0.5, z: -2 },
      rotation: { x: 0, y: 0, z: 0 },
      size: { x: 1, y: 1, z: 1 },
    }),
  },
];

sceneObjects.forEach((obj) => scene.add(obj.object.cube));

/**
 * TODO #2
 * Shows object names in view, not using console.log.
 * Should show each name in its own element instead of using a single <p></p>
 * Tips:
 *  - document.createElement
 *  - Use a simple <p> tag to show the text. (future usage: when clicking element name should hihglight element is scene)
 *  - HTMLElement.prototype.innerText
 *  - Identify <p> tag with #id pick-objects-names
 *  - document.querySelector('#pick-objects-names')
 *  - Use Array.prototype.join(lambda) to convert a array into a string
 */
function displayObjectNames(pickedItems) {
  const namesELement = document.querySelector("#pick-objects-names");

  if (pickedItems.length > 0) {
    const names = pickedItems
      .map((item) => {
        const name = item.object.name || "Objeto sem nome";
        const distance = item.distance;
        return `${name} (${distance})`;
      })
      .join("\n");
    namesELement.innerText = `Objetos possíveis selecionados:\n${names}`;
  } else {
    namesELement.innerText = "nenhum Objeto selecionado.";
  }
}

function PickHelper() {
  const raycaster = new THREE.Raycaster();
  let pickedObjects = [];

  this.pick = (normalizedPosition, scene, camera) => {
    raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedItems = raycaster.intersectObjects(scene.children, true);

    console.log(intersectedItems.map((x) => [x.object.name, x.object.type]));
    const pickedItems = intersectedItems.filter(
      (x) => x.object.type !== "GridHelper"
    );
    console.log("pickedItems", pickedItems);
    displayObjectNames(pickedItems);
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

const toggleButton = document.getElementById("toggleButton");

let isClickEvent = false;

toggleButton.addEventListener("click", () => {
  console.log("Clicou no botão");
  toggleEvent();
});

function onDblClickEvent(event) {
  console.log(`Event`, event);
  setPickPosition(event);
  pickHelper.pick(pickPosition, scene, camera);
}

function onHoverEvent(event) {
  console.log(`Event`, event);
  if (event.type === "mouseenter") {
    setPickPosition(event);
  } else {
    clearPickPosition();
  }
  pickHelper.pick(pickPosition, scene, camera);
}

const toggleEvent = () => {
  /**
   * TODO #03 Javascript Ternary
   * What they are
   * When to use
   * When to not use
   *  */
  isClickEvent = !isClickEvent;
  toggleButton.textContent = isClickEvent ? "Click" : "Hover";
  toggleButton.classList.toggle("off");

  console.log("Toggle Event");
  canvas.removeEventListener("dblclick", onDblClickEvent);
  canvas.removeEventListener("mouseenter", onHoverEvent);
  canvas.removeEventListener("mouseleave", onHoverEvent);

  if (isClickEvent) {
    canvas.addEventListener("dblclick", onDblClickEvent);
    console.log("Modo Click ativado");
  } else {
    canvas.addEventListener("mouseenter", onHoverEvent);
    canvas.addEventListener("mouseleave", onHoverEvent);
    console.log("Modo Hover ativado");
  }
};

toggleEvent();

function render() {
  checkResizeRendererToDisplaySize(renderer);

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
