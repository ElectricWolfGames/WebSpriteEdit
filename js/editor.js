import { gridSize, pixelSize, palette } from "./config.js";
import { state, createEmptyGrid } from "./state.js";

const mainCanvas = document.getElementById("mainCanvas");
mainCanvas.width = gridSize * pixelSize;
mainCanvas.height = gridSize * pixelSize;

const ctx = mainCanvas.getContext("2d");

function drawGrid() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const color = state.grid[y][x];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
            ctx.strokeStyle = "#333";
            ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }
}

function buildPalette() {
    const paletteDiv = document.getElementById("palette");

    palette.forEach((color, index) => {
        const swatch = document.createElement("div");
        swatch.className = "palette-color";
        swatch.style.background = color;

        if (index === 0) {
            swatch.classList.add("selected");
        }

        swatch.addEventListener("click", () => {
            state.selectedColor = color;
            document.querySelectorAll(".palette-color").forEach((item) => {
                item.classList.remove("selected");
            });
            swatch.classList.add("selected");
        });

        paletteDiv.appendChild(swatch);
    });
}

function bindEvents() {
    mainCanvas.addEventListener("click", (event) => {
        const rect = mainCanvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / pixelSize);
        const y = Math.floor((event.clientY - rect.top) / pixelSize);

        if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) {
            return;
        }

        state.grid[y][x] = state.selectedColor;
        drawGrid();
    });
}

export function initEditor() {
    state.grid = createEmptyGrid(gridSize);
    buildPalette();
    bindEvents();
    drawGrid();
}
