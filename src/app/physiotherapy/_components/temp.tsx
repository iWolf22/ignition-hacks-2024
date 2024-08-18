"use client";

// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load handpose DONE
// 6. Detect function DONE
// 7. Drawing utilities DONE
// 8. Draw functions DONE

import getLPTheme from "@/app/getLPTheme";
import AppAppBar from "@/ui-components/AppAppBar";
import "@mediapipe/hands";
import {
    Container,
    createTheme,
    CssBaseline,
    PaletteMode,
    Stack,
    ThemeProvider,
} from "@mui/material";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import * as tf from "@tensorflow/tfjs-backend-webgpu";
import "@tensorflow/tfjs-core";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import * as handpose from "@tensorflow-models/handpose";
import React, {
    Dispatch,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import Webcam from "react-webcam";

const lines = [
    ["wrist", "thumb_cmc"],
    ["thumb_cmc", "thumb_mcp"],
    ["thumb_mcp", "thumb_ip"],
    ["thumb_ip", "thumb_tip"],
    ["wrist", "index_finger_mcp"],
    ["index_finger_mcp", "index_finger_pip"],
    ["index_finger_pip", "index_finger_dip"],
    ["index_finger_dip", "index_finger_tip"],
    ["wrist", "middle_finger_mcp"],
    ["middle_finger_mcp", "middle_finger_pip"],
    ["middle_finger_pip", "middle_finger_dip"],
    ["middle_finger_dip", "middle_finger_tip"],
    ["wrist", "ring_finger_mcp"],
    ["ring_finger_mcp", "ring_finger_pip"],
    ["ring_finger_pip", "ring_finger_dip"],
    ["ring_finger_dip", "ring_finger_tip"],
    ["wrist", "pinky_finger_mcp"],
    ["pinky_finger_mcp", "pinky_finger_pip"],
    ["pinky_finger_pip", "pinky_finger_dip"],
    ["pinky_finger_dip", "pinky_finger_tip"],
];

const fingerTips = [
    "pinky_finger_tip",
    "ring_finger_tip",
    "middle_finger_tip",
    "index_finger_tip",
    "thumb_tip",
];

const handDistance = 200;

export default function PhysiotherapyPage({
    activityState,
    detector,
    setActivityState,
}: {
    activityState: "arm" | "hand" | "legs";
    detector: any;
    setActivityState: Dispatch<SetStateAction<"arm" | "hand" | "legs">>;
}) {
    const webcamRef: any = useRef(null);
    const canvasRef: any = useRef(null);

    const [repCounter, setRepCounter] = useState(0);

    const [handState, setHandState] = useState<"close" | "open">("open");

    const [data, setData] = useState();

    const [deltaHand, setDeltaHand] = useState(0);

    const detect = async (net: any) => {
        // Check data is available
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // Get Video Properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // Set video width
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Set canvas height and width
            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const ctx = canvasRef.current.getContext("2d");

            // Make Detections
            if (activityState === "hand") {
                const hand = await net.estimateHands(video);

                // Draw mesh

                var temp: any = [];
                var temp3D: any = [];

                setData(hand);

                for (var i = 0; i < hand.length; i++) {
                    temp.push({});

                    for (var j = 0; j < hand[i].keypoints.length; j++) {
                        const x = videoWidth - hand[i].keypoints[j].x;
                        const y = hand[i].keypoints[j].y;

                        ctx.beginPath();
                        ctx.arc(x, y, 4, 0, 2 * Math.PI);
                        if (handState === "open") {
                            ctx.fillStyle = "red";
                        } else {
                            ctx.fillStyle = "green";
                        }
                        ctx.fill();

                        temp[i][hand[i].keypoints[j].name] = {
                            x: x,
                            y: y,
                        };
                    }

                    temp3D.push({});

                    for (var j = 0; j < hand[i].keypoints3D.length; j++) {
                        if (
                            ["wrist", ...fingerTips].includes(
                                hand[i].keypoints3D[j].name
                            )
                        ) {
                            temp3D[i][hand[i].keypoints3D[j].name] =
                                hand[i].keypoints3D[j];
                        }
                    }
                }

                var distance = -1;

                if (temp3D.length === 2) {
                    distance = 0;

                    for (var i = 0; i < temp3D.length; i++) {
                        for (var j = 0; j < fingerTips.length; j++) {
                            distance += Math.sqrt(
                                Math.pow(
                                    temp3D[i][fingerTips[j]].x -
                                        temp3D[i]["wrist"].x,
                                    2
                                ) +
                                    Math.pow(
                                        temp3D[i][fingerTips[j]].y -
                                            temp3D[i]["wrist"].y,
                                        2
                                    ) +
                                    Math.pow(
                                        temp3D[i][fingerTips[j]].z -
                                            temp3D[i]["wrist"].z,
                                        2
                                    )
                            );
                        }
                    }
                }

                setDeltaHand(distance);

                for (var i = 0; i < temp.length; i++) {
                    for (var j = 0; j < lines.length; j++) {
                        ctx.beginPath();
                        ctx.moveTo(
                            temp[i][lines[j][0]].x,
                            temp[i][lines[j][0]].y
                        );
                        ctx.lineTo(
                            temp[i][lines[j][1]].x,
                            temp[i][lines[j][1]].y
                        );
                        ctx.stroke();
                    }
                }

                if (distance !== -1) {
                    if (handState === "open" && distance <= 0.8) {
                        setHandState("close");
                    }
                    console.log(handState);
                    if (handState === "close" && distance >= 1.5) {
                        console.log("open");
                        setHandState("open");
                        setRepCounter((x) => (x += 1));
                    }
                }
            } else {
                const body = await detector.estimatePoses(video);

                for (var j = 0; j < body[0].keypoints.length; j++) {
                    const x = videoWidth - body[0].keypoints[j].x;
                    const y = body[0].keypoints[j].y;

                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = "red";
                    ctx.fill();
                }
            }
        }
    };

    useEffect(() => {
        var timeoutId: any = null;

        if (detector) {
            timeoutId = setInterval(
                () => {
                    detect(detector);
                },
                activityState === "hand" ? 50 : 200
            );
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [handState, detector, activityState]);

    const [mode, setMode] = React.useState<PaletteMode>("light");
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    const toggleColorMode = () => {
        setMode((prev: any) => (prev === "dark" ? "light" : "dark"));
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    return (
        <div>
            <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
                <CssBaseline />
                <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
                <Container style={{ marginTop: "120px" }}>
                    <Stack direction="row">
                        <div>
                            <Webcam
                                mirrored={true}
                                ref={webcamRef}
                                style={{
                                    height: 480,
                                    left: 0,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    minHeight: 480,
                                    minWidth: 680,
                                    right: 0,
                                    textAlign: "left",
                                    width: 680,
                                }}
                            />
                            <canvas
                                ref={canvasRef}
                                style={{
                                    height: 480,
                                    left: 0,
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    minHeight: 480,
                                    minWidth: 680,
                                    position: "relative",
                                    right: 0,
                                    textAlign: "center",
                                    top: -480,
                                    width: 680,
                                }}
                            />
                        </div>
                        <div>
                            Stats: {repCounter}
                            <br />
                            Hand State: {handState}
                            <br />
                            Delta Hand: {Math.round(deltaHand * 1000) / 1000}
                            {/* <br />
                            {data &&
                                (data as any).map((hand: any, i: any) => {
                                    return (
                                        <div key={i}>
                                            {hand["keypoints"] &&
                                                (hand["keypoints"] as any).map(
                                                    (val: any, j: any) => {
                                                        return (
                                                            <div key={j}>
                                                                {JSON.stringify(
                                                                    {
                                                                        n: val.name,
                                                                        x: Math.round(
                                                                            val.x
                                                                        ),
                                                                        y: Math.round(
                                                                            val.y
                                                                        ),
                                                                    }
                                                                )}
                                                            </div>
                                                        );
                                                    }
                                                )}
                                        </div>
                                    );
                                })} */}
                        </div>
                    </Stack>
                </Container>
            </ThemeProvider>
        </div>
    );
}
