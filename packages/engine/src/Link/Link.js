"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Link = void 0;
const makeLinkId = (line1, line2) => `${line1.lineId}::${line1.endpoint}-${line2.lineId}::${line2.endpoint}`;
class Link {
    constructor(line1, line2) {
        this.id = makeLinkId(line1, line2);
        this.line1 = line1;
        this.line2 = line2;
        this.activated = true;
    }
}
exports.Link = Link;
