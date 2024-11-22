import * as THREE from "three";
import { pickPosition, scene, camera, setPickPosition } from "./index"


export function onDblClickEvent(event) {
    console.log(`Event`, event);
    setPickPosition(event);
    pickHelper.pick(pickPosition, scene, camera);
}