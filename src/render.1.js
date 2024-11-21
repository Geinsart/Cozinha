import { renderer, scene, camera, controls } from ".";
import { sceneObjects } from "./scene_objects";


export function render() {
    checkResizeRendererToDisplaySize(renderer);

    renderer.render(scene, camera);
    requestAnimationFrame(render);
    controls.update();
}

export function checkResizeRendererToDisplaySize(renderer) {
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
