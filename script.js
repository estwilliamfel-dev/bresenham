/**
 * Implementación del algoritmo de líneas de Bresenham.
 * @param {number} x0 - Coordenada X inicial.
 * @param {number} y0 - Coordenada Y inicial.
 * @param {number} x1 - Coordenada X final.
 * @param {number} y1 - Coordenada Y final.
 * @param {Function} plot - Función para dibujar el píxel (x, y).
 */
function bresenham(x0, y0, x1, y1, plot) {
    // Cálculo de diferenciales y dirección del paso
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;

    while (true) {
        // Dibujar el punto actual
        plot(x0, y0);

        // Condición de finalización
        if (x0 === x1 && y0 === y1) break;

        let e2 = 2 * err;

        // Ajuste en el eje X
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }

        // Ajuste en el eje Y
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}

// Obtener referencias del DOM
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const x0Input = document.getElementById("x0");
const y0Input = document.getElementById("y0");
const x1Input = document.getElementById("x1");
const y1Input = document.getElementById("y1");

const drawBtn = document.getElementById("drawBtn");

// Evento del botón
drawBtn.addEventListener("click", () => {
    const x0 = parseInt(x0Input.value);
    const y0 = parseInt(y0Input.value);
    const x1 = parseInt(x1Input.value);
    const y1 = parseInt(y1Input.value);

    console.log("Coordenadas:", x0, y0, x1, y1);
});