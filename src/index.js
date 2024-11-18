import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { makeBoxInstance, makeBoxInstanceV2 } from "./makeInstance";
import { cameraConfig, lightConfig, axesConfig, gridConfig } from "./core_scene_control"
import { sceneObjects } from "./scene_objects";
import { displayObjectNames, PickHelper, getCanvasRelativePosition, setPickPosition, clearPickPosition } from "./scene_helpers";
import { isClickEvent, onDblClickEvent, onHoverEvent } from "./ui_display"

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

export const camera = new THREE.PerspectiveCamera(
  cameraConfig.fov,
  cameraConfig.aspect,
  cameraConfig.near,
  cameraConfig.far,
)
camera.position.set(
  cameraConfig.position.x,
  cameraConfig.position.y,
  cameraConfig.position.z);


const light = new THREE.AmbientLight(
  lightConfig.color,
  lightConfig.intensity
);
const gridHelper = new THREE.GridHelper(gridConfig);
const axesHelper = new THREE.AxesHelper(axesConfig)

export const scene = new THREE.Scene();
scene.add(gridHelper);
scene.add(axesHelper);
scene.add(light);

export const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
const controls = new OrbitControls(camera, renderer.domElement);
document.body.appendChild(renderer.domElement);

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
PickHelper();

export const pickHelper = new PickHelper();

export const pickPosition = { x: 0, y: 0 };

clearPickPosition();

getCanvasRelativePosition(event);
setPickPosition(event);
clearPickPosition();




const toggleButton = document.getElementById("toggleButton");

toggleButton.addEventListener("click", () => {
  console.log("Clicou no botão");
  toggleEvent();
});


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
