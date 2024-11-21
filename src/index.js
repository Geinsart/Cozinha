import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { cameraConfig, gridHelperConfig, axesHelperConfig, ambientLightConfig } from "./core_scene_control.js"
import { makeBoxInstance, makeBoxInstanceV2 } from "./makeInstance";
import { sceneObjects } from "./scene_objects";
import { displayObjectNames, PickHelper } from "./scene_helpers.js"


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


const camera = new THREE.PerspectiveCamera(
  cameraConfig.fov,
  cameraConfig.aspect,
  cameraConfig.near,
  cameraConfig.far,
)
camera.position.set(
  cameraConfig.position.x,
  cameraConfig.position.y,
  cameraConfig.position.z);


const gridHelper = new THREE.GridHelper(gridHelperConfig.divisions, gridHelperConfig.size);
const axesHelper = new THREE.AxesHelper(axesHelperConfig);
const light = new THREE.AmbientLight(ambientLightConfig.color, ambientLightConfig.intensity);

const scene = new THREE.Scene();
scene.add(gridHelper);
scene.add(axesHelper);
scene.add(light);

const canvas = document.querySelector("#c");
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

