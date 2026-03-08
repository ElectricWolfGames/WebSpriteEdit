import { gridSize, pixelSize, palette } from "./config.js";
import { state, createEmptyFrame } from "./state.js";

const mainCanvas = document.getElementById("mainCanvas");
const onionCanvas = document.getElementById("onionCanvas");

mainCanvas.width = onionCanvas.width = gridSize * pixelSize;
mainCanvas.height = onionCanvas.height = gridSize * pixelSize;

onionCanvas.style.position = "absolute";
onionCanvas.style.left = 0;
onionCanvas.style.top = 0;
onionCanvas.style.opacity = 0.3;

const ctx = mainCanvas.getContext("2d");
const onionCtx = onionCanvas.getContext("2d");

function drawOnion() {
    onionCtx.clearRect(0, 0, onionCanvas.width, onionCanvas.height);

    if (!state.onionEnabled || state.currentFrame === 0) return;

    const prev = state.frames[state.currentFrame - 1];
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const color = prev[y][x];
            if (color) {
                onionCtx.fillStyle = color;
                onionCtx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
        }
    }
}

function drawGrid() {
    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            const color = state.frames[state.currentFrame][y][x];
            if (color) {
                ctx.fillStyle = color;
                ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
            }
            ctx.strokeStyle = "#333";
            ctx.strokeRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
    }

    drawOnion();
}

function updateThumbnails() {
    const framesDiv = document.getElementById("frames");
    framesDiv.innerHTML = "";

    state.frames.forEach((frame, index) => {
        const thumb = document.createElement("canvas");
        thumb.width = gridSize;
        thumb.height = gridSize;
        thumb.className = "frame-thumb";

        const tctx = thumb.getContext("2d");

        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (frame[y][x]) {
                    tctx.fillStyle = frame[y][x];
                    tctx.fillRect(x, y, 1, 1);
                }
            }
        }

        thumb.addEventListener("click", () => {
            state.currentFrame = index;
            drawGrid();
            updateThumbnails();
        });

        if (index === state.currentFrame) {
            thumb.style.border = "2px solid yellow";
        }

        framesDiv.appendChild(thumb);
    });
}

function addFrame() {
    state.frames.push(createEmptyFrame(gridSize));
    state.currentFrame = state.frames.length - 1;
    drawGrid();
    updateThumbnails();
}

function nextFrame() {
    if (state.currentFrame < state.frames.length - 1) {
        state.currentFrame++;
        drawGrid();
        updateThumbnails();
    }
}

function prevFrame() {
    if (state.currentFrame > 0) {
        state.currentFrame--;
        drawGrid();
        updateThumbnails();
    }
}

function toggleOnion() {
    state.onionEnabled = !state.onionEnabled;
    drawGrid();
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

        state.frames[state.currentFrame][y][x] = state.selectedColor;
        drawGrid();
        updateThumbnails();
    });

    document.getElementById("addFrameBtn").addEventListener("click", addFrame);
    document.getElementById("nextFrameBtn").addEventListener("click", nextFrame);
    document.getElementById("prevFrameBtn").addEventListener("click", prevFrame);
    document.getElementById("toggleOnionBtn").addEventListener("click", toggleOnion);
}

export function initEditor() {
    buildPalette();
    bindEvents();
    addFrame();
}
