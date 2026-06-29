"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeMap = exports.serializeMap = void 0;
const LineEditor_1 = require("engine/Line/LineEditor");
const constants_1 = require("engine/constants");
const Line_1 = require("engine/Line/Line");
const Token_1 = require("engine/Token/Token");
const StartEditor_1 = require("engine/Start/StartEditor");
const Start_1 = require("engine/Start/Start");
const SwitchEditor_1 = require("engine/Switch/SwitchEditor");
const Switch_1 = require("engine/Switch/Switch");
const Transformer_1 = require("engine/Transformer/Transformer");
const Inverter_1 = require("engine/Inverter/Inverter");
const ScreenGate_1 = require("engine/ScreenGate/ScreenGate");
const ArrivalEditor_1 = require("engine/Arrival/ArrivalEditor");
const Arrival_1 = require("engine/Arrival/Arrival");
const Help_1 = require("engine/Help/Help");
const serializeMap = (editorManager, tokens, starts, switches, switchLinks, transformers = {}, arrival = null, inverters = {}, screens = ["main"], screenGates = {}, screenTimeMultipliers = {}, helps = {}) => ({
    screens,
    lines: Object.values(editorManager.data.lines).map((l) => ({
        id: l.id,
        start: l.start,
        end: l.end,
        type: l.type,
        ...(l.cp1 ? { cp1: l.cp1 } : {}),
        ...(l.cp2 ? { cp2: l.cp2 } : {}),
        ...(l.boost !== 0 ? { boost: l.boost } : {}),
        ...(l.flip ? { flip: true } : {}),
        ...(l.tunnel ? { tunnel: true } : {}),
        ...(l.showSpeed ? { showSpeed: l.showSpeed } : {}),
        ...(l.limitation !== 0 ? { limitation: l.limitation } : {}),
        ...(l.type === "sine" ? { frequency: l.frequency, amplitude: l.amplitude } : {}),
        ...(l.type === "spiral" ? { turns: l.turns } : {}),
        ...(l.screenId !== "main" ? { screenId: l.screenId } : {}),
    })),
    links: Object.values(editorManager.data.links).map((lk) => ({
        id: lk.id,
        line1: lk.line1,
        line2: lk.line2,
        activated: lk.activated,
    })),
    tokens: Object.values(tokens).map((t) => ({
        id: t.id,
        color: t.color,
        type: t.type,
        speed: t.speed,
    })),
    starts: Object.values(starts).map((s) => ({
        id: s.id,
        lineId: s.lineId,
        endpoint: s.endpoint,
        delay: s.delay,
        ...(s.screenId !== "main" ? { screenId: s.screenId } : {}),
    })),
    switches: Object.fromEntries(Object.values(switches).map((sw) => [
        sw.id,
        {
            linkIds: sw.linkIds,
            activeLinkId: sw.activeLinkId,
            linkedSwitchIds: switchLinks[sw.id] ?? [],
            ...(sw.screenId !== "main" ? { screenId: sw.screenId } : {}),
            ...(sw.color !== "#1a73e8" ? { color: sw.color } : {}),
        },
    ])),
    transformers: Object.values(transformers).map((tr) => ({
        id: tr.id,
        linkId: tr.linkId,
        type: tr.type,
        amount: tr.amount,
        color: tr.color,
        targetType: tr.targetType,
        ...(tr.screenId !== "main" ? { screenId: tr.screenId } : {}),
    })),
    inverters: Object.values(inverters).map((inv) => ({
        id: inv.id,
        linkId: inv.linkId,
        ...(inv.screenId !== "main" ? { screenId: inv.screenId } : {}),
        ...(inv.effect !== "invert" ? { effect: inv.effect } : {}),
    })),
    arrival: arrival
        ? {
            id: arrival.id,
            lineId: arrival.lineId,
            endpoint: arrival.endpoint,
            demands: arrival.demands,
            ...(arrival.screenId !== "main" ? { screenId: arrival.screenId } : {}),
        }
        : null,
    screenGates: Object.values(screenGates).map((sg) => ({
        id: sg.id,
        linkId: sg.linkId,
        targetScreenId: sg.targetScreenId,
        entryKey: sg.entryKey,
        exitKey: sg.exitKey,
        ...(sg.screenId !== "main" ? { screenId: sg.screenId } : {}),
    })),
    ...(Object.keys(screenTimeMultipliers).length > 0 ? { screenTimeMultipliers } : {}),
    ...(Object.keys(helps).length > 0 ? { helps: Object.values(helps).map((h) => ({ id: h.id, x: h.x, y: h.y, text: h.text, arrow: h.arrow, ...(h.screenId !== "main" ? { screenId: h.screenId } : {}) })) } : {}),
});
exports.serializeMap = serializeMap;
const deserializeMap = (json, editorManager) => {
    editorManager.data.lines = {};
    editorManager.data.links = {};
    json.lines?.forEach(({ id, start, end, type, cp1, cp2, boost, flip, tunnel, showSpeed, limitation, frequency, amplitude, turns, screenId }) => {
        const line = new LineEditor_1.LineEditor(start, end, type ?? "straight", id, cp1, cp2, screenId);
        if (boost)
            line.boost = boost;
        if (flip) {
            line.flip = true;
            line.computePoints();
        }
        if (tunnel)
            line.tunnel = true;
        if (showSpeed)
            line.showSpeed = showSpeed;
        if (limitation)
            line.limitation = limitation;
        if (type === "sine") {
            if (frequency !== undefined)
                line.frequency = frequency;
            if (amplitude !== undefined)
                line.amplitude = amplitude;
            line.computePoints();
        }
        if (type === "spiral") {
            if (turns !== undefined)
                line.turns = turns;
            line.computePoints();
        }
        editorManager.addLine(line);
    });
    (0, Line_1.syncLineCounter)(json.lines?.map((l) => l.id) ?? []);
    json.links?.forEach(({ id, activated }) => {
        const link = editorManager.data.links[id];
        if (link)
            link.activated = activated;
    });
    const tokens = {};
    json.tokens?.forEach(({ id, color, type, speed }) => {
        const t = new Token_1.Token(color, speed, id, type ?? "round");
        tokens[t.id] = t;
    });
    (0, Token_1.syncTokenCounter)(Object.keys(tokens));
    const starts = {};
    json.starts?.forEach(({ id, lineId, endpoint, delay, screenId }) => {
        const s = new StartEditor_1.StartEditor(lineId, endpoint, delay, id, screenId);
        starts[s.id] = s;
    });
    (0, Start_1.syncStartCounter)(Object.keys(starts));
    const switches = {};
    const switchLinks = {};
    Object.entries(json.switches ?? {}).forEach(([id, { linkIds, activeLinkId, linkedSwitchIds, screenId, color }]) => {
        const sw = new SwitchEditor_1.SwitchEditor(id, linkIds ?? [], activeLinkId ?? null, screenId);
        if (color)
            sw.color = color;
        switches[sw.id] = sw;
        switchLinks[id] = linkedSwitchIds ?? [];
    });
    (0, Switch_1.syncSwitchCounter)(Object.keys(switches));
    const transformers = {};
    json.transformers?.forEach(({ id, linkId, type, amount, color, targetType, screenId }) => {
        transformers[id] = new Transformer_1.Transformer(linkId, type, id, amount ?? 0.5, color ?? constants_1.COLOR_TOKEN_RED, targetType ?? "square", screenId);
    });
    json.tokenEffects?.forEach(({ id, linkId, type, amount }) => {
        const migId = `transform_te_${id}`;
        transformers[migId] = new Transformer_1.Transformer(linkId, type, migId, amount ?? 0.5);
    });
    json.rotators?.forEach(({ id, linkId }) => {
        const migId = `transform_rot_${id}`;
        transformers[migId] = new Transformer_1.Transformer(linkId, "rotate", migId);
    });
    json.faders?.forEach(({ id, linkId, amount }) => {
        const migId = `transform_fad_${id}`;
        transformers[migId] = new Transformer_1.Transformer(linkId, "fade", migId, amount ?? 0.5);
    });
    json.painters?.forEach(({ id, linkId, color }) => {
        const migId = `transform_pt_${id}`;
        transformers[migId] = new Transformer_1.Transformer(linkId, "color", migId, 0.5, color);
    });
    (0, Transformer_1.syncTransformerCounter)(Object.keys(transformers));
    const inverters = {};
    json.inverters?.forEach(({ id, linkId, screenId, effect }) => {
        const inv = new Inverter_1.Inverter(linkId, id, screenId);
        if (effect)
            inv.effect = effect;
        inverters[id] = inv;
    });
    (0, Inverter_1.syncInverterCounter)(Object.keys(inverters));
    let arrival = null;
    if (json.arrival) {
        arrival = new ArrivalEditor_1.ArrivalEditor(json.arrival.lineId, json.arrival.endpoint, json.arrival.id, (json.arrival.demands ?? []), json.arrival.screenId);
        (0, Arrival_1.syncArrivalCounter)([json.arrival.id]);
    }
    const screens = json.screens ?? ["main"];
    const screenGates = {};
    json.screenGates?.forEach(({ id, linkId, screenId, targetScreenId, entryKey, exitKey }) => {
        screenGates[id] = new ScreenGate_1.ScreenGate(linkId, id, screenId, targetScreenId, entryKey, exitKey);
    });
    (0, ScreenGate_1.syncScreenGateCounter)(Object.keys(screenGates));
    const screenTimeMultipliers = json.screenTimeMultipliers ?? {};
    const helps = {};
    json.helps?.forEach(({ id, x, y, text, arrow, screenId }) => {
        helps[id] = new Help_1.Help(x, y, text, arrow, screenId ?? "main", id);
    });
    (0, Help_1.syncHelpCounter)(Object.keys(helps));
    return { tokens, starts, switches, switchLinks, transformers, inverters, arrival, screens, screenGates, screenTimeMultipliers, helps };
};
exports.deserializeMap = deserializeMap;
