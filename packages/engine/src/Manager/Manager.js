"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Manager = void 0;
class Manager {
    constructor() {
        this.data = { lines: {} };
        this.addLine = (line) => {
            this.data.lines[line.id] = line;
        };
        this.removeLine = (id) => {
            delete this.data.lines[id];
        };
    }
}
exports.Manager = Manager;
