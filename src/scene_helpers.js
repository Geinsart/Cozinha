import * as THREE from "three";
import { sceneObjects } from "./scene_objects";
import { displayObjectNames } from "./ui_display";
import { loadScene } from "./core_scene_control.js";

const { scene, camera } = loadScene(); //import solicitado na última semana

const default_pickPosition = { x: 0, y: 0 };

export function PickHelper(canvas, pickPosition = default_pickPosition) {
  const raycaster = new THREE.Raycaster();


  function getCanvasRelativePosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * canvas.width) / rect.width,
      y: ((event.clientY - rect.top) * canvas.height) / rect.height,
    };
  }

  function getNormalizedPositionFromEvent(event) {
    const pos = getCanvasRelativePosition(event);
    const x = (pos.x / canvas.width) * 2 - 1;
    const y = (pos.y / canvas.height) * -2 + 1;
    return {
      x,
      y,
    };
  }

  function pickEvent(event, scene, camera) {
    const normalizedPosition = getNormalizedPositionFromEvent(event);
    raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedItems = raycaster.intersectObjects(scene.children, true);

    console.log(intersectedItems.map((x) => [x.object.name, x.object.type]));
    const pickedItems = intersectedItems.filter(
      (x) => x.object.type !== "GridHelper" && x.object.name !== "walls"
        && x.object.name !== "chinaCabinet"

    );
    console.log("pickedItems", pickedItems);
    displayObjectNames(pickedItems);
  }


  return {
    pickPosition,
    pickEvent,
  };
}

export function PickOnDblClickEvent(pickHelper, event) {
  console.log(`Event`, event);
  pickHelper.pickEvent(event, scene, camera);
}

export function PickOnHoverEvent(pickHelper, event) {
  // import scene, camera
  pickHelper.pickEvent(event, scene, camera);
}
