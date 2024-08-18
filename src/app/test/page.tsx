"use client";

import { useLoader } from "@react-three/fiber";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";

export default function Page() {
    const fbx = useLoader(FBXLoader, "/angryguy.fbx");

    return (
        <div>
            Test
            <primitive object={fbx} />
        </div>
    );
}
