"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchEditor = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const Switch_1 = require("./Switch");
const switchUtils_1 = require("./switchUtils");
class SwitchEditor extends Switch_1.Switch {
    constructor(id, linkIds, activeLinkId, screenId) {
        super(id, linkIds, activeLinkId, screenId);
        this.render = (links, lines, hovered) => {
            const ep = (0, switchUtils_1.getSwitchEnterPoint)(this.linkIds, links);
            if (!ep)
                return null;
            const line = lines[ep.lineId];
            if (!line)
                return null;
            const pt = ep.endpoint === "end" ? line.end : line.start;
            const { RADIUS, COLOR, OPACITY_DEFAULT } = SwitchEditor;
            return ((0, jsx_runtime_1.jsx)("circle", { cx: pt.x, cy: pt.y, r: RADIUS, fill: COLOR, opacity: hovered ? 1 : OPACITY_DEFAULT }, this.id));
        };
    }
}
exports.SwitchEditor = SwitchEditor;
SwitchEditor.RADIUS = 18;
SwitchEditor.COLOR = "#7c3aed";
SwitchEditor.OPACITY_DEFAULT = 0.4;
