import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"; // movimentar a tela
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

const sceneObjects = [
  makeBoxInstance(
    //geladeira
    0x0000ff,
    { x: -1, y: 1, z: -2 },
    { x: 0, y: 0, z: 0 },
    { x: 1, y: 2, z: 1 }
  ),

  makeBoxInstance(
    // cubo invertido
    0xffa500,
    { x: 0.9, y: 1.75, z: -0.05 },
    { x: 0, y: 0, z: 0 },
    { x: 5, y: 3.5, z: 5 },
    THREE.BackSide
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
];

const cubeCooktop = makeBoxInstanceV2(
  {
    color: 0x00ff00,
    position: { x: 0, y: 0.5, z: -2 },
    rotation: { x: 0, y: 0, z: 0 },
    size: { x: 1, y: 1, z: 1 },
  },
);

sceneObjects.push(cubeCooktop);

sceneObjects.forEach((obj) => scene.add(obj.cube));

class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, scene, camera, time) {
    // restore the color if there is a picked object
    if (this.pickedObject) {
      this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
      this.pickedObject = undefined;
    }
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(scene.children);
    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      this.pickedObject = intersectedObjects[0].object;
      // save its color
      this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
      // set its emissive color to flashing red/yellow
      this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xff0000 : 0xffa500);
    }
  }
}

const pickPosition = { x: 0, y: 0 };
clearPickPosition();


function getCanvasRelativePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * canvas.width / rect.width,
    y: (event.clientY - rect.top) * canvas.height / rect.height,
  };
}

function setPickPosition(event) {
  const pos = getCanvasRelativePosition(event);
  pickPosition.x = (pos.x / canvas.width) * 2 - 1;
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
}

function clearPickPosition() {
  // unlike the mouse which always has a position
  // if the user stops touching the screen we want
  // to stop picking. For now we just pick a value
  // unlikely to pick something
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

window.addEventListener('mousemove', setPickPosition);
window.addEventListener('mouseout', clearPickPosition);
window.addEventListener('mouseleave', clearPickPosition);

window.addEventListener('touchstart', (event) => {
  // prevent the window from scrolling
  event.preventDefault();
  setPickPosition(event.touches[0]);
}, { passive: false });

window.addEventListener('touchmove', (event) => {
  setPickPosition(event.touches[0]);
});

window.addEventListener('touchend', clearPickPosition);

const pickHelper = new PickHelper();


function render() {
  try {
    checkResizeRendererToDisplaySize(renderer);

    console.log("Pick Position:", pickPosition);
    console.log("Scene:", scene);
    console.log("Camera:", camera);
    console.log("Time:", time);

    pickHelper.pick(pickPosition, scene, camera, time);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
    controls.update();
  } catch (error) {
    console.error("Erro durante a renderização:", error);
  }
}

document.getElementById("colorButton").addEventListener("click", function () {
  const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffa500, 0x800080, 0xffff00];
  let currentColor = cubeCooktop.cube.material.color.getHex();
  let newColor;

  do {
    newColor = colors[Math.floor(Math.random() * colors.length)];
  } while (newColor === currentColor);

  cubeCooktop.setColor(newColor);
});


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
