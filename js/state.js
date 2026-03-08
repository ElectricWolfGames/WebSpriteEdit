import { palette } from "./config.js";

export const state = {
    grid: [],
    selectedColor: palette[0]
};

export function createEmptyGrid(gridSize) {
    return Array(gridSize).fill().map(() => Array(gridSize).fill(null));
}
