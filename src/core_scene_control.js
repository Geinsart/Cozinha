import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const cameraConfig = {
  fov: 75,
  aspect: 2, // the canvas default
  near: 0.1,
  far: 10,
  position: { x: 1, y: 1, z: 2 },
};

const camera = new THREE.PerspectiveCamera(
  cameraConfig.fov,
  cameraConfig.aspect,
  cameraConfig.near,
  cameraConfig.far
);

const gridHelperConfig = {
  size: 5,
  divisions: 10,
};

const axesHelperConfig = 3;

const ambientLightConfig = {
  color: 0xffffff,
  intensity: 1,
};

const gridHelper = new THREE.GridHelper(
  gridHelperConfig.divisions,
  gridHelperConfig.size
);
const light = new THREE.AmbientLight(
  ambientLightConfig.color,
  ambientLightConfig.intensity
);

const axesHelper = new THREE.AxesHelper(axesHelperConfig);

const scene = new THREE.Scene();

/**
 * Load the scene with the camera, grid helper, axes helper, and light
 * @param {Object} position - The position of the camera
 * @param {number} position.x - The x position of the camera
 * @param {number} position.y - The y position of the camera
 * @param {number} position.z - The z position of the camera
 */
export function loadScene(position = cameraConfig.position) {
  camera.position.set(position.x, position.y, position.z);

  scene.add(gridHelper);
  //scene.add(axesHelper);
  scene.add(light);

  return {
    camera,
    scene,
  };
}

/**
 * Get the render core with the renderer, controls, and render function
 * @param {HTMLCanvasElement} canvas - The canvas element
 * @param {THREE.PerspectiveCamera} camera - The camera
 * @param {THREE.Scene} scene - The scene
 * @returns {Object} - The render core with the render function/
 */
export function getRenderCore(canvas, camera, scene) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

  // TODO: Why do document.body.appendChild is required if Canvas is already defined in HTML?
  document.body.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);

  function checkResizeRendererToDisplaySize(renderer) {
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

  function render() {
    checkResizeRendererToDisplaySize(renderer);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
    controls.update();
  }

  const core = {
    render,
    checkResizeRendererToDisplaySize,
  };
  return core;
}
