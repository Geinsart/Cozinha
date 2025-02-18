import { isClickEvent, toggleButton, canvas, onDblClickEvent, onHoverEvent } from ".";

export const toggleEvent = () => {

    isClickEvent = !isClickEvent;
    toggleButton.textContent = isClickEvent ? "Click" : "Hover";
    toggleButton.classList.toggle("off");

    console.log("Toggle Event");
    canvas.removeEventListener("dblclick", onDblClickEvent);
    canvas.removeEventListener("mouseenter", onHoverEvent);
    canvas.removeEventListener("mouseleave", onHoverEvent);

    if (isClickEvent) {
        canvas.addEventListener("dblclick", onDblClickEvent);
        console.log("Modo Click ativado");
    } else {
        canvas.addEventListener("mouseenter", onHoverEvent);
        canvas.addEventListener("mouseleave", onHoverEvent);
        console.log("Modo Hover ativado");
    }
};
