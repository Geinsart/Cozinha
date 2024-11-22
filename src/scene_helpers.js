import * as THREE from "three";
import { sceneObjects } from "./scene_objects"


export function displayObjectNames(pickedItems) {
    const namesELement = document.querySelector("#pick-objects-names");

    namesELement.innerHTML = "";

    if (pickedItems.length > 0) {
        const names = pickedItems
            .map((item) => {
                const name = item.object.name || "Objeto sem nome";
                const distance = item.distance.toFixed(1);

                const p = document.createElement("p");
                p.innerText = `${name} (${distance})`;
                namesELement.appendChild(p);
            });


    } else {
        namesELement.innerText = "nenhum Objeto selecionado.";
    }
};

export function PickHelper() {
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
