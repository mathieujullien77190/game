import type { MapJson } from "./mapJson";

export const DEFAULT_MAP: MapJson = {
  screens: ["main", "screen1", "screen2"],
  lines: [
    {
      id: "lineA",
      start: {
        x: 200,
        y: 680,
      },
      end: {
        x: 60,
        y: 660,
      },
      type: "straight",
      cp1: {
        x: 200,
        y: 646.6666666666666,
      },
      cp2: {
        x: 200,
        y: 613.3333333333334,
      },
    },
    {
      id: "lineB",
      start: {
        x: 200,
        y: 560,
      },
      end: {
        x: 200,
        y: 500,
      },
      type: "straight",
      cp1: {
        x: 200,
        y: 553.3333333333334,
      },
      cp2: {
        x: 200,
        y: 526.6666666666666,
      },
    },
    {
      id: "lineC",
      start: {
        x: 200,
        y: 500,
      },
      end: {
        x: 100,
        y: 500,
      },
      type: "straight",
      cp1: {
        x: 166.66666666666666,
        y: 500,
      },
      cp2: {
        x: 133.33333333333331,
        y: 500,
      },
    },
    {
      id: "lineD",
      start: {
        x: 200,
        y: 500,
      },
      end: {
        x: 200,
        y: 400,
      },
      type: "straight",
      cp1: {
        x: 200,
        y: 466.6666666666667,
      },
      cp2: {
        x: 200,
        y: 433.3333333333333,
      },
    },
    {
      id: "lineE",
      start: {
        x: 300,
        y: 580,
      },
      end: {
        x: 300,
        y: 620,
      },
      type: "straight",
      cp1: {
        x: 300,
        y: 613.3333333333334,
      },
      cp2: {
        x: 300,
        y: 646.6666666666666,
      },
    },
    {
      id: "lineF",
      start: {
        x: 100,
        y: 500,
      },
      end: {
        x: 80,
        y: 360,
      },
      type: "curve",
      cp1: {
        x: 30.82116788321168,
        y: 503.64963503649636,
      },
      cp2: {
        x: 37.82846715328467,
        y: 371.3868613138686,
      },
      boost: 100,
    },
    {
      id: "lineG",
      start: {
        x: 80,
        y: 360,
      },
      end: {
        x: 60,
        y: 140,
      },
      type: "sine",
      cp1: {
        x: 60,
        y: 273.3333333333333,
      },
      cp2: {
        x: 60,
        y: 206.66666666666666,
      },
      boost: 100,
      frequency: 4,
      amplitude: 20,
    },
    {
      id: "lineH",
      start: {
        x: 200,
        y: 400,
      },
      end: {
        x: 200,
        y: 300,
      },
      type: "straight",
      cp1: {
        x: 200,
        y: 366.6666666666667,
      },
      cp2: {
        x: 200,
        y: 333.3333333333333,
      },
    },
    {
      id: "lineI",
      start: {
        x: 200,
        y: 300,
      },
      end: {
        x: 200,
        y: 140,
      },
      type: "straight",
      cp1: {
        x: 200,
        y: 246.66666666666666,
      },
      cp2: {
        x: 200,
        y: 193.33333333333331,
      },
    },
    {
      id: "lineJ",
      start: {
        x: 200,
        y: 140,
      },
      end: {
        x: 300,
        y: 240,
      },
      type: "curve",
      cp1: {
        x: 184.10583941605842,
        y: 49.05109489051095,
      },
      cp2: {
        x: 314.6167883211679,
        y: 63.94160583941606,
      },
    },
    {
      id: "lineK",
      start: {
        x: 60,
        y: 140,
      },
      end: {
        x: 380,
        y: 180,
      },
      type: "curve",
      cp1: {
        x: 183.22992700729927,
        y: 69.1970802919708,
      },
      cp2: {
        x: 275.20072992700733,
        y: 11.386861313868614,
      },
    },
    {
      id: "lineL",
      start: {
        x: 380,
        y: 180,
      },
      end: {
        x: 300,
        y: 240,
      },
      type: "curve",
      cp1: {
        x: 404.8357664233577,
        y: 205.83941605839416,
      },
      cp2: {
        x: 326.00364963503654,
        y: 198.83211678832117,
      },
    },
    {
      id: "lineM",
      start: {
        x: 300,
        y: 280,
      },
      end: {
        x: 300,
        y: 440,
      },
      type: "straight",
      cp1: {
        x: 300,
        y: 333.3333333333333,
      },
      cp2: {
        x: 300,
        y: 386.6666666666667,
      },
    },
    {
      id: "lineN",
      start: {
        x: 300,
        y: 440,
      },
      end: {
        x: 300,
        y: 580,
      },
      type: "straight",
      cp1: {
        x: 300,
        y: 486.6666666666667,
      },
      cp2: {
        x: 300,
        y: 533.3333333333334,
      },
    },
    {
      id: "lineO",
      start: {
        x: 200,
        y: 40,
      },
      end: {
        x: 200,
        y: 660,
      },
      type: "sine",
      cp1: {
        x: 200,
        y: 246.66666666666666,
      },
      cp2: {
        x: 200,
        y: 453.3333333333333,
      },
      frequency: 5,
      amplitude: 56,
      screenId: "screen1",
    },
    {
      id: "lineP",
      start: {
        x: 80,
        y: 360,
      },
      end: {
        x: 100,
        y: 500,
      },
      type: "curve",
      cp1: {
        x: 179.72627737226279,
        y: 348.6131386861314,
      },
      cp2: {
        x: 192.86496350364965,
        y: 475.6204379562044,
      },
    },
    {
      id: "lineQ",
      start: {
        x: 300,
        y: 280,
      },
      end: {
        x: 360,
        y: 440,
      },
      type: "straight",
      cp1: {
        x: 320,
        y: 333.3333333333333,
      },
      cp2: {
        x: 340,
        y: 386.6666666666667,
      },
    },
    {
      id: "lineR",
      start: {
        x: 360,
        y: 440,
      },
      end: {
        x: 300,
        y: 580,
      },
      type: "straight",
      cp1: {
        x: 340,
        y: 486.6666666666667,
      },
      cp2: {
        x: 320,
        y: 533.3333333333334,
      },
    },
    {
      id: "lineS",
      start: {
        x: 200,
        y: 60,
      },
      end: {
        x: 200,
        y: 660,
      },
      type: "straight",
      cp1: {
        x: 200,
        y: 260,
      },
      cp2: {
        x: 200,
        y: 460,
      },
      screenId: "screen2",
    },
    {
      id: "lineT",
      start: {
        x: 300,
        y: 240,
      },
      end: {
        x: 300,
        y: 280,
      },
      type: "straight",
      cp1: {
        x: 300,
        y: 253.33333333333334,
      },
      cp2: {
        x: 300,
        y: 266.6666666666667,
      },
    },
    {
      id: "lineV",
      start: {
        x: 300,
        y: 620,
      },
      end: {
        x: 200,
        y: 560,
      },
      type: "curve",
      cp1: {
        x: 283.0839416058394,
        y: 704.2335766423358,
      },
      cp2: {
        x: 213.88686131386862,
        y: 629.7810218978102,
      },
    },
    {
      id: "lineW",
      start: {
        x: 300,
        y: 620,
      },
      end: {
        x: 300,
        y: 680,
      },
      type: "straight",
      cp1: {
        x: 300,
        y: 640,
      },
      cp2: {
        x: 300,
        y: 660,
      },
    },
    {
      id: "line1",
      start: {
        x: 60,
        y: 660,
      },
      end: {
        x: 60,
        y: 620,
      },
      type: "curve",
      cp1: {
        x: 60,
        y: 660,
      },
      cp2: {
        x: 60,
        y: 660,
      },
    },
    {
      id: "line2",
      start: {
        x: 60,
        y: 620,
      },
      end: {
        x: 60,
        y: 560,
      },
      type: "straight",
      cp1: {
        x: 60,
        y: 600,
      },
      cp2: {
        x: 60,
        y: 580,
      },
      tunnel: true,
    },
    {
      id: "line3",
      start: {
        x: 60,
        y: 560,
      },
      end: {
        x: 200,
        y: 560,
      },
      type: "curve",
      cp1: {
        x: 36.95255474452555,
        y: 511.5328467153285,
      },
      cp2: {
        x: 170.96715328467155,
        y: 615.7664233576643,
      },
    },
  ],
  links: [
    {
      id: "lineB::end-lineC::start",
      line1: {
        lineId: "lineB",
        endpoint: "end",
      },
      line2: {
        lineId: "lineC",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineB::end-lineD::start",
      line1: {
        lineId: "lineB",
        endpoint: "end",
      },
      line2: {
        lineId: "lineD",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineC::start-lineD::start",
      line1: {
        lineId: "lineC",
        endpoint: "start",
      },
      line2: {
        lineId: "lineD",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineC::end-lineF::start",
      line1: {
        lineId: "lineC",
        endpoint: "end",
      },
      line2: {
        lineId: "lineF",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineF::end-lineG::start",
      line1: {
        lineId: "lineF",
        endpoint: "end",
      },
      line2: {
        lineId: "lineG",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineD::end-lineH::start",
      line1: {
        lineId: "lineD",
        endpoint: "end",
      },
      line2: {
        lineId: "lineH",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineH::end-lineI::start",
      line1: {
        lineId: "lineH",
        endpoint: "end",
      },
      line2: {
        lineId: "lineI",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineI::end-lineJ::start",
      line1: {
        lineId: "lineI",
        endpoint: "end",
      },
      line2: {
        lineId: "lineJ",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineG::end-lineK::start",
      line1: {
        lineId: "lineG",
        endpoint: "end",
      },
      line2: {
        lineId: "lineK",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineJ::end-lineL::end",
      line1: {
        lineId: "lineJ",
        endpoint: "end",
      },
      line2: {
        lineId: "lineL",
        endpoint: "end",
      },
      activated: true,
    },
    {
      id: "lineK::end-lineL::start",
      line1: {
        lineId: "lineK",
        endpoint: "end",
      },
      line2: {
        lineId: "lineL",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineE::start-lineN::end",
      line1: {
        lineId: "lineE",
        endpoint: "start",
      },
      line2: {
        lineId: "lineN",
        endpoint: "end",
      },
      activated: true,
    },
    {
      id: "lineM::end-lineN::start",
      line1: {
        lineId: "lineM",
        endpoint: "end",
      },
      line2: {
        lineId: "lineN",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineC::end-lineP::end",
      line1: {
        lineId: "lineC",
        endpoint: "end",
      },
      line2: {
        lineId: "lineP",
        endpoint: "end",
      },
      activated: false,
    },
    {
      id: "lineF::start-lineP::end",
      line1: {
        lineId: "lineF",
        endpoint: "start",
      },
      line2: {
        lineId: "lineP",
        endpoint: "end",
      },
      activated: true,
    },
    {
      id: "lineF::end-lineP::start",
      line1: {
        lineId: "lineF",
        endpoint: "end",
      },
      line2: {
        lineId: "lineP",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineG::start-lineP::start",
      line1: {
        lineId: "lineG",
        endpoint: "start",
      },
      line2: {
        lineId: "lineP",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineM::start-lineQ::start",
      line1: {
        lineId: "lineM",
        endpoint: "start",
      },
      line2: {
        lineId: "lineQ",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineE::start-lineR::end",
      line1: {
        lineId: "lineE",
        endpoint: "start",
      },
      line2: {
        lineId: "lineR",
        endpoint: "end",
      },
      activated: true,
    },
    {
      id: "lineN::end-lineR::end",
      line1: {
        lineId: "lineN",
        endpoint: "end",
      },
      line2: {
        lineId: "lineR",
        endpoint: "end",
      },
      activated: false,
    },
    {
      id: "lineQ::end-lineR::start",
      line1: {
        lineId: "lineQ",
        endpoint: "end",
      },
      line2: {
        lineId: "lineR",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineJ::end-lineT::start",
      line1: {
        lineId: "lineJ",
        endpoint: "end",
      },
      line2: {
        lineId: "lineT",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineL::end-lineT::start",
      line1: {
        lineId: "lineL",
        endpoint: "end",
      },
      line2: {
        lineId: "lineT",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineM::start-lineT::end",
      line1: {
        lineId: "lineM",
        endpoint: "start",
      },
      line2: {
        lineId: "lineT",
        endpoint: "end",
      },
      activated: true,
    },
    {
      id: "lineQ::start-lineT::end",
      line1: {
        lineId: "lineQ",
        endpoint: "start",
      },
      line2: {
        lineId: "lineT",
        endpoint: "end",
      },
      activated: true,
    },
    {
      id: "lineB::start-lineV::end",
      line1: {
        lineId: "lineB",
        endpoint: "start",
      },
      line2: {
        lineId: "lineV",
        endpoint: "end",
      },
      activated: true,
    },
    {
      id: "lineE::end-lineV::start",
      line1: {
        lineId: "lineE",
        endpoint: "end",
      },
      line2: {
        lineId: "lineV",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineE::end-lineW::start",
      line1: {
        lineId: "lineE",
        endpoint: "end",
      },
      line2: {
        lineId: "lineW",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineV::start-lineW::start",
      line1: {
        lineId: "lineV",
        endpoint: "start",
      },
      line2: {
        lineId: "lineW",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineA::end-line1::start",
      line1: {
        lineId: "lineA",
        endpoint: "end",
      },
      line2: {
        lineId: "line1",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "line1::end-line2::start",
      line1: {
        lineId: "line1",
        endpoint: "end",
      },
      line2: {
        lineId: "line2",
        endpoint: "start",
      },
      activated: true,
    },
    {
      id: "lineB::start-line3::end",
      line1: {
        lineId: "lineB",
        endpoint: "start",
      },
      line2: {
        lineId: "line3",
        endpoint: "end",
      },
      activated: true,
    },
    {
      id: "lineV::end-line3::end",
      line1: {
        lineId: "lineV",
        endpoint: "end",
      },
      line2: {
        lineId: "line3",
        endpoint: "end",
      },
      activated: false,
    },
    {
      id: "line2::end-line3::start",
      line1: {
        lineId: "line2",
        endpoint: "end",
      },
      line2: {
        lineId: "line3",
        endpoint: "start",
      },
      activated: true,
    },
  ],
  tokens: [
    {
      id: "token1",
      color: "#43a047",
      type: "square",
      speed: 100,
    },
    {
      id: "token2",
      color: "#8e24aa",
      type: "round",
      speed: 40,
    },
  ],
  starts: [
    {
      id: "start1",
      lineId: "lineA",
      endpoint: "start",
      delay: 3,
    },
  ],
  switches: {
    switch1: {
      linkIds: ["lineB::end-lineC::start", "lineB::end-lineD::start"],
      activeLinkId: "lineB::end-lineC::start",
      linkedSwitchIds: [],
    },
    switch3: {
      linkIds: ["lineM::start-lineT::end", "lineQ::start-lineT::end"],
      activeLinkId: "lineM::start-lineT::end",
      linkedSwitchIds: [],
    },
    switch4: {
      linkIds: ["lineE::end-lineV::start", "lineE::end-lineW::start"],
      activeLinkId: "lineE::end-lineV::start",
      linkedSwitchIds: [],
    },
    switch5: {
      linkIds: ["lineF::end-lineG::start", "lineF::end-lineP::start"],
      activeLinkId: "lineF::end-lineG::start",
      linkedSwitchIds: [],
    },
  },
  transformers: [
    {
      id: "transform1",
      linkId: "lineD::end-lineH::start",
      type: "rotate",
      amount: 0.5,
      color: "#e53935",
      targetType: "square",
    },
    {
      id: "transform2",
      linkId: "lineI::end-lineJ::start",
      type: "color",
      amount: 0.5,
      color: "#f9ab00",
      targetType: "square",
    },
    {
      id: "transform3",
      linkId: "lineG::end-lineK::start",
      type: "fade",
      amount: 0.1,
      color: "#e53935",
      targetType: "square",
    },
    {
      id: "transform4",
      linkId: "lineH::end-lineI::start",
      type: "fade",
      amount: 1,
      color: "#e53935",
      targetType: "square",
    },
    {
      id: "transform5",
      linkId: "lineK::end-lineL::start",
      type: "shape",
      amount: 0.5,
      color: "#e53935",
      targetType: "square",
    },
  ],
  inverters: [],
  arrival: {
    id: "arrival2",
    lineId: "lineW",
    endpoint: "end",
    demands: [
      {
        id: "demand1",
        color: "#f9ab00",
        type: "square",
        angled: false,
      },
    ],
  },
  screenGates: [
    {
      id: "gate1",
      linkId: "lineM::end-lineN::start",
      targetScreenId: "screen1",
      entryKey: "lineO::start",
      exitKey: "lineO::end",
    },
    {
      id: "gate2",
      linkId: "lineQ::end-lineR::start",
      targetScreenId: "screen2",
      entryKey: "lineS::start",
      exitKey: "lineS::end",
    },
  ],
  screenTimeMultipliers: {
    screen1: 10,
    screen2: 0.05,
  },
};
