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
      side: THREE.BackSide
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
      rotation: { x: 0, y: 90 * Math.PI / 180, z: 0 },
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
  )
];

sceneObjects.forEach((obj) => scene.add(obj.cube));



const names = [
  { name: "freezer", object: sceneObjects[0] },
  { name: "walls", object: sceneObjects[1] },
  { name: "sink", object: sceneObjects[2] },
  { name: "chinaCabinet", object: sceneObjects[3] },
  { name: "cooktop", object: sceneObjects[4] },
];




function PickHelper() {
  const raycaster = new THREE.Raycaster();
  let pickedObject = null;

  this.pick = (normalizedPosition, scene, camera) => {
    raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedObjects = raycaster.intersectObjects(scene.children, true);


    if (intersectedObjects.length > 0) {
      pickedObject = intersectedObjects[0].object;
    }

    const found = names.find((item) => item.object.cube === pickedObject);

    if (found) {
      console.log("Objeto selecionado", found.name);
    } else {
      console.log("Objeto selecionado não tem um nome associado.");
    }
  };
}

const pickHelper = new PickHelper()

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
  pickPosition.y = (pos.y / canvas.height) * -2 + 1;
}

function clearPickPosition() {
  pickPosition.x = -100000;
  pickPosition.y = -100000;
}

window.addEventListener("click", setPickPosition);
canvas.addEventListener("mouseout", clearPickPosition);


function render() {
  checkResizeRendererToDisplaySize(renderer);
  pickHelper.pick(pickPosition, scene, camera)
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

// Inicia a animação
requestAnimationFrame(render);

// Adiciona um listener para redimensionamento
window.addEventListener(
  "resize",
  () => {
    checkResizeRendererToDisplaySize(renderer);
  },
  false
);
