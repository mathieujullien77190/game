"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Help = exports.syncHelpCounter = void 0;
let helpCounter = 1;
const syncHelpCounter = (ids) => {
    const nums = ids.map((id) => parseInt(id.replace("h", ""), 10)).filter((n) => !isNaN(n));
    if (nums.length > 0)
        helpCounter = Math.max(...nums) + 1;
};
exports.syncHelpCounter = syncHelpCounter;
class Help {
    constructor(x, y, text = "", arrow = "none", screenId = "main", id) {
        this.id = id ?? `h${helpCounter++}`;
        this.x = x;
        this.y = y;
        this.text = text;
        this.arrow = arrow;
        this.screenId = screenId;
    }
}
exports.Help = Help;
