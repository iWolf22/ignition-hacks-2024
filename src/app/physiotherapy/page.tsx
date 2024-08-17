"use client";

// 1. Install dependencies DONE
// 2. Import dependencies DONE
// 3. Setup webcam and canvas DONE
// 4. Define references to those DONE
// 5. Load handpose DONE
// 6. Detect function DONE
// 7. Drawing utilities DONE
// 8. Draw functions DONE

import "@mediapipe/hands";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@tensorflow/tfjs-core";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import * as handpose from "@tensorflow-models/handpose";
import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import AppAppBar from "@/ui-components/AppAppBar";

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

export default function Page() {
    const webcamRef: any = useRef(null);
    const canvasRef: any = useRef(null);

    const runHandpose = async () => {
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detector = await handPoseDetection.createDetector(model, {
            runtime: "mediapipe",
            solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
            // or 'base/node_modules/@mediapipe/hands' in npm.
        });

        console.log("Handpose model loaded.");
        //  Loop and detect hands
        setInterval(() => {
            detect(detector);
        }, 50);
    };

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
            const hand = await net.estimateHands(video);

            // Draw mesh
            const ctx = canvasRef.current.getContext("2d");

            var temp: any = [];

            for (var i = 0; i < hand.length; i++) {
                temp.push({});

                for (var j = 0; j < hand[i].keypoints.length; j++) {
                    const x = videoWidth - hand[i].keypoints[j].x;
                    const y = hand[i].keypoints[j].y;

                    ctx.beginPath();
                    ctx.arc(x, y, 4, 0, 2 * Math.PI);
                    ctx.fillStyle = "red";
                    ctx.fill();

                    temp[i][hand[i].keypoints[j].name] = { x: x, y: y };
                }
            }

            for (var i = 0; i < temp.length; i++) {
                for (var j = 0; j < lines.length; j++) {
                    ctx.beginPath();
                    ctx.moveTo(temp[i][lines[j][0]].x, temp[i][lines[j][0]].y);
                    ctx.lineTo(temp[i][lines[j][1]].x, temp[i][lines[j][1]].y);
                    ctx.stroke();
                }
            }
        }
    };

    useEffect(() => {
        runHandpose();
    }, []);

    const [mode, setMode] = React.useState<PaletteMode>('light');
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    const toggleColorMode = () => {
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    return (
        <div>
            <AppAppBar />
                <Webcam
                    mirrored={true}
                    ref={webcamRef}
                    style={{
                        height: 480,
                        left: 0,
                        marginLeft: "auto",
                        marginRight: "auto",
                        minHeight: 480,
                        minWidth: 640,
                        position: "absolute",
                        right: 0,
                        textAlign: "center",
                        width: 640,
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
                        minWidth: 640,
                        position: "absolute",
                        right: 0,
                        textAlign: "center",
                        width: 640,
                    }}
                />
            </div>
        </div>
    );
}
