import { palette } from "./config.js";

export const state = {
    frames: [],
    currentFrame: 0,
    selectedColor: palette[0],
    onionEnabled: true
};

export function createEmptyFrame(gridSize) {
    return Array(gridSize).fill().map(() => Array(gridSize).fill(null));
}
