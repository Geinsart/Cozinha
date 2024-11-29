import * as THREE from "three";
import { makeBoxInstanceV2 } from "./makeInstance";

export const sceneObjects = [
    {
        name: "freezer",
        object: makeBoxInstanceV2({
            name: "freezer",
            color: 0x0000ff,
            position: { x: -1, y: 1, z: -2 },
            rotation: { x: 0, y: 0, z: 0 },
            size: { x: 1, y: 2, z: 1 },
        }),
    },

    {
        name: "walls",
        object: makeBoxInstanceV2({
            name: "walls",
            color: 0xffa500,
            position: { x: 0.9, y: 1.75, z: -0.05 },
            rotation: { x: 0, y: 0, z: 0 },
            size: { x: 5, y: 3.5, z: 5 },
            side: THREE.BackSide,
        }),
    },

    {
        name: "sink",
        object: makeBoxInstanceV2({
            name: "sink",
            color: 0x800080,
            position: { x: 1.9, y: 0.5, z: -2 },
            rotation: { x: 0, y: 0, z: 0 },
            size: { x: 2.6, y: 1, z: 1 },
        }),
    },

    {
        name: "chinaCabinet",
        object: makeBoxInstanceV2({
            name: "chinaCabinet",
            color: 0x800080,
            position: { x: -1, y: 0.8, z: 1.4 },
            rotation: { x: 0, y: (90 * Math.PI) / 180, z: 0 },
            size: { x: 2, y: 1.5, z: 1 },
        }),
    },
    {
        name: "cooktop",
        object: makeBoxInstanceV2({
            name: "cooktop",
            color: 0x00ff00,
            position: { x: 0, y: 0.5, z: -2 },
            rotation: { x: 0, y: 0, z: 0 },
            size: { x: 1, y: 1, z: 1 },
        }),
    },
];