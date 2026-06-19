import type { LevelJSON } from "engine/Manager";

const demo: LevelJSON = {
  lines: [
    { id: "line1",  type: "line", start: { x: 160, y: 40  }, end: { x: 160, y: 100 }, color: "#6b7280" },
    { id: "line2",  type: "line", start: { x: 160, y: 100 }, end: { x: 80,  y: 160 }, color: "#6b7280" },
    { id: "line3",  type: "line", start: { x: 160, y: 100 }, end: { x: 240, y: 160 }, color: "#6b7280" },
    { id: "line4",  type: "line", start: { x: 80,  y: 160 }, end: { x: 40,  y: 240 }, color: "#ef4444" },
    { id: "line5",  type: "line", start: { x: 80,  y: 160 }, end: { x: 120, y: 240 }, color: "#6b7280" },
    { id: "line6",  type: "line", start: { x: 240, y: 160 }, end: { x: 200, y: 240 }, color: "#3b82f6" },
    { id: "line7",  type: "line", start: { x: 240, y: 160 }, end: { x: 280, y: 240 }, color: "#22c55e" },
    { id: "line8",  type: "line", start: { x: 40,  y: 240 }, end: { x: 80,  y: 320 }, color: "#ef4444" },
    { id: "line9",  type: "line", start: { x: 120, y: 240 }, end: { x: 80,  y: 320 }, color: "#6b7280" },
    { id: "line10", type: "line", start: { x: 120, y: 240 }, end: { x: 200, y: 320 }, color: "#6b7280" },
    { id: "line11", type: "line", start: { x: 200, y: 240 }, end: { x: 200, y: 320 }, color: "#3b82f6" },
    { id: "line12", type: "line", start: { x: 280, y: 240 }, end: { x: 200, y: 320 }, color: "#22c55e" },
    { id: "line13", type: "line", start: { x: 80,  y: 320 }, end: { x: 160, y: 420 }, color: "#6b7280" },
    { id: "line14", type: "line", start: { x: 200, y: 320 }, end: { x: 160, y: 420 }, color: "#6b7280" },
    { id: "line15", type: "line", start: { x: 160, y: 420 }, end: { x: 160, y: 480 }, color: "#6b7280" },
  ],
  links: [
    { id: "link1",  active: true,  line1: { id: "line1",  anchor: "end" }, line2: { id: "line2",  anchor: "start" } },
    { id: "link2",  active: false, line1: { id: "line1",  anchor: "end" }, line2: { id: "line3",  anchor: "start" } },
    { id: "link3",  active: true,  line1: { id: "line2",  anchor: "end" }, line2: { id: "line4",  anchor: "start" } },
    { id: "link4",  active: false, line1: { id: "line2",  anchor: "end" }, line2: { id: "line5",  anchor: "start" } },
    { id: "link5",  active: true,  line1: { id: "line3",  anchor: "end" }, line2: { id: "line6",  anchor: "start" } },
    { id: "link6",  active: false, line1: { id: "line3",  anchor: "end" }, line2: { id: "line7",  anchor: "start" } },
    { id: "link7",  active: true,  line1: { id: "line4",  anchor: "end" }, line2: { id: "line8",  anchor: "start" } },
    { id: "link8",  active: true,  line1: { id: "line5",  anchor: "end" }, line2: { id: "line9",  anchor: "start" } },
    { id: "link9",  active: false, line1: { id: "line5",  anchor: "end" }, line2: { id: "line10", anchor: "start" } },
    { id: "link10", active: true,  line1: { id: "line6",  anchor: "end" }, line2: { id: "line11", anchor: "start" } },
    { id: "link11", active: true,  line1: { id: "line7",  anchor: "end" }, line2: { id: "line12", anchor: "start" } },
    { id: "link12", active: true,  line1: { id: "line8",  anchor: "end" }, line2: { id: "line13", anchor: "start" } },
    { id: "link13", active: true,  line1: { id: "line9",  anchor: "end" }, line2: { id: "line13", anchor: "start" } },
    { id: "link14", active: true,  line1: { id: "line10", anchor: "end" }, line2: { id: "line14", anchor: "start" } },
    { id: "link15", active: true,  line1: { id: "line11", anchor: "end" }, line2: { id: "line14", anchor: "start" } },
    { id: "link16", active: true,  line1: { id: "line12", anchor: "end" }, line2: { id: "line14", anchor: "start" } },
    { id: "link17", active: true,  line1: { id: "line13", anchor: "end" }, line2: { id: "line15", anchor: "start" } },
    { id: "link18", active: true,  line1: { id: "line14", anchor: "end" }, line2: { id: "line15", anchor: "start" } },
  ],
  starts: [
    { id: "start1", position: { id: "line1", anchor: "start" }, delay: 800 },
  ],
  arrivals: [
    { id: "arrival1", position: { id: "line15", anchor: "end" } },
  ],
  switches: [
    { id: "switch1", input: { id: "line1",  anchor: "end" } },
    { id: "switch2", input: { id: "line2",  anchor: "end" } },
    { id: "switch3", input: { id: "line3",  anchor: "end" } },
    { id: "switch4", input: { id: "line5",  anchor: "end" } },
  ],
  painters: [
    { id: "painter1", input: { id: "line4", anchor: "end" }, color: "#ef4444" },
    { id: "painter2", input: { id: "line6", anchor: "end" }, color: "#3b82f6" },
    { id: "painter3", input: { id: "line7", anchor: "end" }, color: "#22c55e" },
  ],
  tokens: [
    { id: "token1", color: "#eab308", speed: 3, shape: "circle"  },
    { id: "token2", color: "#f97316", speed: 2, shape: "circle"  },
    { id: "token3", color: "#8b5cf6", speed: 3, shape: "square"  },
    { id: "token4", color: "#ec4899", speed: 4, shape: "circle"  },
    { id: "token5", color: "#14b8a6", speed: 2, shape: "square"  },
    { id: "token6", color: "#f43f5e", speed: 3, shape: "circle"  },
    { id: "token7", color: "#6b7280", speed: 4, shape: "square"  },
  ],
};

export default demo;
