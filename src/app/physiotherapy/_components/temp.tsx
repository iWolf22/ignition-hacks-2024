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
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import PanToolIcon from "@mui/icons-material/PanTool";
import SportsIcon from "@mui/icons-material/Sports";
import {
    Card,
    Container,
    createTheme,
    CssBaseline,
    PaletteMode,
    Stack,
    ThemeProvider,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
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

const bodyLines = [
    [20, 18],
    [18, 16],
    [16, 22],
    [20, 22],
    [16, 14],
    [14, 12],
    [12, 11],
    [11, 13],
    [13, 15],
    [15, 21],
    [21, 19],
    [19, 17],
    [17, 15],
    [11, 23],
    [12, 24],
    [24, 23],
    [23, 25],
    [25, 27],
    [27, 29],
    [27, 31],
    [29, 31],
    [24, 26],
    [26, 28],
    [28, 32],
    [28, 30],
    [32, 30],
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

            // Make Detections
            if (activityState === "hand") {
                const hand = await net.estimateHands(video);

                const ctx = canvasRef.current.getContext("2d");

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

                const ctx = canvasRef.current.getContext("2d");

                for (var j = 0; j < body[0].keypoints.length; j++) {
                    const x = videoWidth - body[0].keypoints[j].x;
                    const y = body[0].keypoints[j].y;

                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    if (handState === "open") {
                        ctx.fillStyle = "red";
                    } else {
                        ctx.fillStyle = "green";
                    }
                    ctx.fill();
                }

                for (var j = 0; j < bodyLines.length; j++) {
                    ctx.beginPath();
                    ctx.moveTo(
                        videoWidth - body[0].keypoints[bodyLines[j][0]].x,
                        body[0].keypoints[bodyLines[j][0]].y
                    );
                    ctx.lineTo(
                        videoWidth - body[0].keypoints[bodyLines[j][1]].x,
                        body[0].keypoints[bodyLines[j][1]].y
                    );
                    ctx.stroke();
                }

                if (
                    body[0].keypoints[16].score > 0.6 &&
                    body[0].keypoints[15].score > 0.6 &&
                    body[0].keypoints[24].score > 0.6 &&
                    body[0].keypoints[23].score > 0.6
                ) {
                    const delta =
                        Math.sqrt(
                            (body[0].keypoints[16].x -
                                body[0].keypoints[24].x) **
                                2 +
                                (body[0].keypoints[16].y -
                                    body[0].keypoints[24].y) **
                                    2
                        ) +
                        Math.sqrt(
                            (body[0].keypoints[15].x -
                                body[0].keypoints[23].x) **
                                2 +
                                (body[0].keypoints[15].y -
                                    body[0].keypoints[23].y) **
                                    2
                        );

                    if (handState === "open" && delta > 600) {
                        setHandState("close");
                        setRepCounter((x) => (x += 1));
                    }
                    if (handState === "close" && delta < 200) {
                        setHandState("open");
                    }
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
                activityState === "hand" ? 50 : 150
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
                <AppAppBar
                    mode={mode}
                    setActivityState={setActivityState}
                    toggleColorMode={toggleColorMode}
                />
                <Container style={{ marginTop: "120px" }}>
                    <Stack direction="row">
                        <div>
                            <Webcam
                                mirrored={true}
                                ref={webcamRef}
                                style={{
                                    backgroundColor: "#2d9f52",
                                    border: "5px 100px 0px 0px solid #2d9f52",
                                    borderBottom: "0px",
                                    borderRadius: "10px",
                                    borderTop: "0px",
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
                        <div style={{ paddingLeft: "32px", width: "100%" }}>
                            <Card
                                sx={(theme) => ({
                                    background:
                                        theme.palette.mode === "light"
                                            ? "#e9ffe9"
                                            : "#05280a",
                                    borderColor:
                                        theme.palette.mode === "light"
                                            ? "#d4e5e1"
                                            : "#1b3726",
                                    boxShadow:
                                        theme.palette.mode === "light"
                                            ? `0 0 1px rgba(0, 255, 0, 0.1), 1px 1.5px 2px -1px rgba(0, 255, 0, 0.15), 4px 4px 12px -2.5px rgba(0, 255, 0, 0.15)` // Green shadow
                                            : "0 0 1px rgba(0, 80, 0, 0.7), 1px 1.5px 2px -1px rgba(0, 80, 0, 0.65), 4px 4px 12px -2.5px rgba(0, 80, 0, 0.65)", // Dark green shadow
                                })}
                            >
                                <div
                                    style={{
                                        alignItems: "center",
                                        display: "flex",
                                        justifyContent: "space-between",
                                        margin: "16px",
                                        width: "calc(100% - 32px)",
                                    }}
                                >
                                    <div>
                                        {activityState === "arm" ? (
                                            <span
                                                style={{
                                                    alignItems: "center",
                                                    display: "flex",
                                                    gap: "5px",
                                                }}
                                            >
                                                <AccessibilityNewIcon /> Arm
                                                Raises
                                            </span>
                                        ) : (
                                            <span
                                                style={{
                                                    alignItems: "center",
                                                    display: "flex",
                                                    gap: "5px",
                                                }}
                                            >
                                                <PanToolIcon /> Hand Squeezes
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <span
                                            style={{
                                                alignItems: "center",
                                                display: "flex",
                                                gap: "5px",
                                            }}
                                        >
                                            <FitnessCenterIcon /> Reps:{" "}
                                            {repCounter}
                                        </span>
                                    </div>
                                    <div>
                                        <span
                                            style={{
                                                alignItems: "center",
                                                display: "flex",
                                                gap: "5px",
                                            }}
                                        >
                                            <SportsIcon />{" "}
                                            {activityState === "arm"
                                                ? handState === "open"
                                                    ? "Raise arms"
                                                    : "Lower arms"
                                                : handState === "open"
                                                  ? "Squeeze hand"
                                                  : "Open hand"}
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </Stack>
                </Container>
            </ThemeProvider>
        </div>
    );
}
