import React from "react";
import { Composition } from "remotion";
import { Short, sceneStarts } from "./Short";
import { FPS, HEIGHT, WIDTH } from "./theme";
import type { ShortProps } from "./types";
import sample from "../scripts/cash-flow-system.json";

export const Root: React.FC = () => (
  <Composition
    id="Short"
    component={Short as unknown as React.FC<Record<string, unknown>>}
    width={WIDTH}
    height={HEIGHT}
    fps={FPS}
    durationInFrames={300}
    defaultProps={sample as unknown as Record<string, unknown>}
    calculateMetadata={({ props }) => ({
      durationInFrames: sceneStarts(props as unknown as ShortProps).total,
    })}
  />
);
