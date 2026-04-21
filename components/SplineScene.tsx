"use client";

import Spline from "@splinetool/react-spline";

type SplineSceneProps = {
  sceneUrl: string;
};

export default function SplineScene({ sceneUrl }: SplineSceneProps) {
  return (
    <Spline
      key={sceneUrl}
      scene={sceneUrl}
      className="absolute inset-0 h-full w-full"
      style={{ minHeight: "100%" }}
    />
  );
}
