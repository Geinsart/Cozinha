import {
  PickHelper,
  PickOnDblClickEvent,
  PickOnHoverEvent,
} from "./scene_helpers.js";

export function displayObjectNames(pickedItems) {
  const namesELement = document.querySelector("#pick-objects-names");
  const turnOnButton = document.getElementById("ligar");
  //const labelTurnOnButton = document.getElementById("labelLigar");

  namesELement.innerHTML = "";

  if (pickedItems.length > 0) {
    const names = pickedItems.map((item) => {
      const name = item.object.name || "Objeto sem nome";
      const distance = item.distance.toFixed(1);
      turnOnButton.style.display = 'block';

      const p = document.createElement("p");
      p.innerText = `${name} (${distance})`;
      namesELement.appendChild(p);
    });
  } else {
    namesELement.innerText = "nenhum Objeto selecionado.";
    turnOnButton.style.display = 'none';
  }
}

const toggleButton = document.getElementById("toggleButton");

let isClickEvent = false;

export const toggleEvents = (canvas, pickHelper) => {

  isClickEvent = !isClickEvent;
  toggleButton.textContent = isClickEvent ? "Click" : "Hover";
  toggleButton.classList.toggle("off");

  const onDblClick = (event) => PickOnDblClickEvent(pickHelper, event);
  const onMouseHover = (event) => PickOnHoverEvent(pickHelper, event);

  console.log("Toggle Event");
  canvas.removeEventListener("dblclick", onDblClick);
  canvas.removeEventListener("mouseenter", onMouseHover);
  canvas.removeEventListener("mouseleave", onMouseHover);

  if (isClickEvent) {
    canvas.addEventListener("dblclick", onDblClick);
    console.log("Modo Click ativado");
  } else {
    canvas.addEventListener("mouseenter", onMouseHover);
    canvas.addEventListener("mouseleave", onMouseHover);
    console.log("Modo Hover ativado");
  }
};

export function loadButtonEvents(canvas) {
  const pickHelper = new PickHelper(canvas);

  toggleEvents(canvas, pickHelper);
  toggleButton.addEventListener("click", () => {
    console.log("Clicou no botão");
    toggleEvents(canvas, pickHelper);
  });
}
