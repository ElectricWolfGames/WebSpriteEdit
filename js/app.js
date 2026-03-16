const gridSize = 32;
const pixelSize = 16;

const palette = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00",
    "#FF00FF", "#00FFFF", "#FFA500", "#800080", "#A52A2A", "#808080",
    "#FFC0CB", "#90EE90", "#87CEEB", "#FFD700", "#1E90FF", "#FF69B4"
];

const state = {
    grid: [],
    selectedColor: palette[0]
};

function createEmptyGrid(size) {
    return Array(size).fill(null).map(() => Array(size).fill(null));
}

function initEditor() {
    const mainCanvas = document.getElementById("mainCanvas");
    const paletteDiv = document.getElementById("palette");

    if (!mainCanvas || !paletteDiv) {
        return;
    }

    mainCanvas.width = gridSize * pixelSize;
    mainCanvas.height = gridSize * pixelSize;

    const ctx = mainCanvas.getContext("2d");
    if (!ctx) {
        return;
    }

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
        paletteDiv.innerHTML = "";

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

    state.grid = createEmptyGrid(gridSize);
    buildPalette();
    drawGrid();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEditor);
} else {
    initEditor();
}
