/**
 * Implementación del algoritmo de líneas de Bresenham.
 * @param {number} x0 - Coordenada X inicial.
 * @param {number} y0 - Coordenada Y inicial.
 * @param {number} x1 - Coordenada X final.
 * @param {number} y1 - Coordenada Y final.
 * @param {Function} plot - Función para dibujar el píxel (x, y).
 * @param {Function} logStep - Función para registrar las variables paso a paso para la tabla.
 */

function bresenham(x0, y0, x1, y1, plot, logStep) {
    // Cálculo de diferenciales y dirección del paso
    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = (x0 < x1) ? 1 : -1;
    let sy = (y0 < y1) ? 1 : -1;
    let err = dx - dy;
    let step = 0; // Contador de pasos para la tabla

    while (true) {
        // Dibujar el punto actual
        plot(x0, y0);

      // Condición de finalización evaluada antes de registrar e2
        const isEnd = (x0 === x1 && y0 === y1);
        
        // Registra las variables justo después de dibujar y calcular el error actual
        logStep(step++, { x: x0, y: y0, dx, dy, sx, sy, err, e2: isEnd ? '-' : 2 * err });

        if (isEnd) break;

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

// Escala máxima de coordenadas
const MAX_COORD = 100; // porfa no te vuelvas a romper
const MARGIN = 30;  //ahora si funciona el margen :)
const drawWidth = canvas.width - MARGIN;
const drawHeight = canvas.height - MARGIN;
const scaleX = canvas.width / MAX_COORD; 
const scaleY = canvas.height / MAX_COORD;

// Referencia al cuerpo de la tabla en el DOM
const tableBody = document.querySelector("#dataTable tbody");

function toCanvasCoords(x, y) {
    return { 
        x: MARGIN + (x * scaleX),
        y: (canvas.height - MARGIN) - (y * scaleY)
    };
}

function plot(x, y) {
    let pos = toCanvasCoords(x, y);
    ctx.fillStyle = "red";
    // Redondeamos el tamaño y sumamos 1px para evitar huecos transparentes por antialiasing
    const w = Math.ceil(scaleX) + 1;
    const h = Math.ceil(scaleY) + 1;
    ctx.fillRect(pos.x, pos.y - h, w, h);
}

/**
 *  Dibuja una cuadrícula de fondo gris claro en el área de dibujo.
 * 
 */
function drawGrid() {
    const step = 10; // Dibuja línea cada 10 unidades de coordenada
    
    ctx.beginPath();
    ctx.strokeStyle = "#e0e0e0"; // Gris muy claro
    ctx.lineWidth = 1;

    // Líneas verticales
    for (let x = 0; x <= MAX_COORD; x += step) {
        let bottom = toCanvasCoords(x, 0);
        let top = toCanvasCoords(x, MAX_COORD);
        ctx.moveTo(bottom.x, bottom.y);
        ctx.lineTo(top.x, top.y);
    }

    // Líneas horizontales
    for (let y = 0; y <= MAX_COORD; y += step) {
        let left = toCanvasCoords(0, y);
        let right = toCanvasCoords(MAX_COORD, y);
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
    }

    ctx.stroke();
    ctx.lineWidth = 1; // se restaura el grosor por si acaso
}


/**
 * Dibuja los ejes cartesianos con marcas de escala
 * en el canvas (eje X inferior y eje Y izquierdo)
 */
function drawAxes() {
    const width = canvas.width;
    const height = canvas.height;
    const step = 10; // distancia entre marcas

    ctx.clearRect(0, 0, width, height);
    drawGrid(); // Dibuja la cuadrícula de fondo

    ctx.beginPath();
    ctx.strokeStyle = "#000";
    ctx.fillStyle = "#000";
    let origin = toCanvasCoords(0, 0);
    
    // Eje X (horizontal abajo)
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(width, origin.y);

    // Eje Y (vertical izquierda)
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(origin.x, height);

    ctx.stroke();
    ctx.font = "10px Arial";

    // Marcas en eje X
    for (let x = 0; x <= MAX_COORD; x += step) {
             let pos = toCanvasCoords(x, 0);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x, pos.y + 5); // marca hacia arriba
        ctx.stroke();
        ctx.fillText(x, pos.x - 5, pos.y + 20);
    }

    // Marcas en eje Y
    for (let y = 0; y <= MAX_COORD; y += step) {
         let pos = toCanvasCoords(0, y);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(pos.x - 5, pos.y); // marca hacia la izquierda
        ctx.stroke();
        ctx.fillText(y, pos.x - 25, pos.y + 4);
    }
}

drawAxes();

/**
 * Agrega una fila a la tabla con los valores actuales del algoritmo.
 * @param {number} step - Número del paso actual.
 * @param {Object} v - Objeto que contiene las variables involucradas (x, y, dx, dy, sx, sy, err, e2).
 */
function logToTable(step, v) {
    const row = document.createElement("tr");
    // e2 se calcula después de revisar la condición de parada, así que validamos si existe
    const e2Val = v.e2 !== undefined ? v.e2 : '-'; 
    row.innerHTML = `
        <td>${step}</td>
        <td>${v.x}</td>
        <td>${v.y}</td>
        <td>${v.dx}</td>
        <td>${v.dy}</td>
        <td>${v.sx}</td>
        <td>${v.sy}</td>
        <td>${v.err}</td>
        <td>${e2Val}</td>
    `;
    tableBody.appendChild(row);
}
// Evento del botón
//  añade (e) como parámetro para capturar el evento del botón
drawBtn.addEventListener("click", (e) => {
    // asi prevenimos recargas de página fantasma gg
    e.preventDefault();
    const x0 = parseInt(x0Input.value);
    const y0 = parseInt(y0Input.value);
    const x1 = parseInt(x1Input.value);
    const y1 = parseInt(y1Input.value);

    console.log("Coordenadas:", x0, y0, x1, y1);

    //Limpia la tabla antes de hacer un nuevo trazado
    tableBody.innerHTML = "";
    
    drawAxes();
    bresenham(x0, y0, x1, y1, plot, logToTable); // dibujar línea
});
