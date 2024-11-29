function setPickPosition(event) {
    const pos = getCanvasRelativePosition(event);
    pickPosition.x = (pos.x / canvas.width) * 2 - 1;
    pickPosition.y = (pos.y / canvas.height) * -2 + 1;
}

function clearPickPosition() {
    pickPosition.x = -100000;
    pickPosition.y = -100000;
}

function pick(normalizedPosition, scene, camera) {
    raycaster.setFromCamera(normalizedPosition, camera);
    const intersectedItems = raycaster.intersectObjects(scene.children, true);

    console.log(intersectedItems.map((x) => [x.object.name, x.object.type]));
    const pickedItems = intersectedItems.filter(
        (x) => x.object.type !== "GridHelper"
    );
    console.log("pickedItems", pickedItems);
    displayObjectNames(pickedItems);
}