import * as THREE from "three";


export const cameraConfig = {
    fov: 75,
    aspect: 2, // the canvas default
    near: 0.1,
    far: 10,
    position: { x: 1, y: 1, z: 2 }
}


export const gridHelperConfig =
{
    size: 5,
    divisions: 10
};

export const axesHelperConfig = 3;

export const ambientLightConfig = {
    color: 0xffffff,
    intensity: 1,
};


