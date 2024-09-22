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

function render() {
  checkResizeRendererToDisplaySize(renderer);

  renderer.render(scene, camera);
  requestAnimationFrame(render);
  controls.update();
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
