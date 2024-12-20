import * as THREE from "three";


export function makeBoxInstanceV2(args) {
  const { color, position, rotation, size, side = THREE.FrontSide } = args;

  const material = new THREE.MeshLambertMaterial({
    color: color,
    side: side,
  });
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const cube = new THREE.Mesh(boxGeometry, material);

  cube.position.set(position.x, position.y, position.z);

  cube.rotation.set(rotation.x, rotation.y, rotation.z);

  cube.scale.set(size.x, size.y, size.z);

  function setColor(newColor) {
    material.color.set(newColor);
  }

  function addToScene(scene) {
    scene.add(cube);
  }

  cube.name = args.name;

  return {
    cube,
    setColor,
    addToScene,
  };
}
