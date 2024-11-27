import { loadScene, getRenderCore } from "./core_scene_control.js";
import { sceneObjects } from "./scene_objects";
import { loadButtonEvents } from "./ui_display.js";
const canvas = document.querySelector("#c");

const { scene, camera } = loadScene();
const renderCore = getRenderCore(canvas, camera, scene);

const { render, checkResizeRendererToDisplaySize } = renderCore;

sceneObjects.forEach((obj) => scene.add(obj.object.cube));

loadButtonEvents(canvas);
requestAnimationFrame(render);

// Adiciona um listener para redimensionamento
window.addEventListener(
  "resize",
  () => {
    checkResizeRendererToDisplaySize(renderer);
  },
  false
);
