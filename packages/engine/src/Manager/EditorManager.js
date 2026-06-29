"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorManager = void 0;
const Link_1 = require("../Link/Link");
const Manager_1 = require("./Manager");
const pointsEqual = (a, b) => a.x === b.x && a.y === b.y;
class EditorManager extends Manager_1.Manager {
    constructor() {
        super(...arguments);
        this.data = {
            lines: {},
            links: {},
        };
        this.addLine = (line) => {
            for (const existing of Object.values(this.data.lines)) {
                if (existing.screenId !== line.screenId)
                    continue;
                for (const ep1 of ["start", "end"]) {
                    for (const ep2 of ["start", "end"]) {
                        if (pointsEqual(existing[ep1], line[ep2])) {
                            const link = new Link_1.Link({ lineId: existing.id, endpoint: ep1 }, { lineId: line.id, endpoint: ep2 });
                            this.data.links[link.id] = link;
                        }
                    }
                }
            }
            this.data.lines[line.id] = line;
        };
        this.removeLine = (id) => {
            delete this.data.lines[id];
            for (const linkId of Object.keys(this.data.links)) {
                const link = this.data.links[linkId];
                if (link.line1.lineId === id || link.line2.lineId === id) {
                    delete this.data.links[linkId];
                }
            }
        };
        this.refreshLinksForEndpoint = (lineId, endpoint) => {
            for (const linkId of Object.keys(this.data.links)) {
                const link = this.data.links[linkId];
                if ((link.line1.lineId === lineId && link.line1.endpoint === endpoint) ||
                    (link.line2.lineId === lineId && link.line2.endpoint === endpoint)) {
                    delete this.data.links[linkId];
                }
            }
            const movedLine = this.data.lines[lineId];
            if (!movedLine)
                return;
            const movedPoint = movedLine[endpoint];
            for (const other of Object.values(this.data.lines)) {
                if (other.id === lineId)
                    continue;
                if (other.screenId !== movedLine.screenId)
                    continue;
                for (const ep of ["start", "end"]) {
                    if (pointsEqual(movedPoint, other[ep])) {
                        const link = new Link_1.Link({ lineId, endpoint }, { lineId: other.id, endpoint: ep });
                        this.data.links[link.id] = link;
                    }
                }
            }
        };
    }
}
exports.EditorManager = EditorManager;
