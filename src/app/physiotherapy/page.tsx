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
import PhysiotherapyPage from "@/app/physiotherapy/_components/temp";
import OpenAIAssistant from "@/components/OpenAIAssistant";
import AppAppBar from "@/ui-components/AppAppBar";
import "@mediapipe/hands";
import "@mediapipe/pose";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgpu";
import "@tensorflow/tfjs-core";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import * as handpose from "@tensorflow-models/handpose";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
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

export default function Page() {
    const { data: session } = useSession();

    if (!session || !session.user) {
        redirect("/api/auth/signin");
    }
    const [detectorState, setDetectorState]: any = useState();

    const [activityState, setActivityState] = useState<"arm" | "hand" | "legs">(
        "arm"
    );

    useEffect(() => {
        (async () => {
            if (activityState === "hand") {
                const model = handPoseDetection.SupportedModels.MediaPipeHands;
                const detector = await handPoseDetection.createDetector(model, {
                    runtime: "mediapipe",
                    solutionPath:
                        "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
                    // or 'base/node_modules/@mediapipe/hands' in npm.
                });

                setDetectorState(detector);
            } else {
                await tf.ready();

                const model = poseDetection.SupportedModels.BlazePose;
                const detector = await poseDetection.createDetector(model, {
                    enableSmoothing: true,
                    modelType: "full",
                    runtime: "tfjs",
                });

                setDetectorState(detector);
            }
        })();
    });

    return (
        <PhysiotherapyPage
            activityState={activityState}
            detector={detectorState}
            setActivityState={setActivityState}
        />
    );
}
