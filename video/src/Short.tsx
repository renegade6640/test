import React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import "@fontsource/space-grotesk/300.css";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/700.css";
import { Caption } from "./Caption";
import { Icon } from "./Icon";
import { brand, FPS } from "./theme";
import type { Card, ShortProps } from "./types";

const CARD_W = 840;
const CARD_H = 440;
const TRANSITION = 18; // frames for the stack to move to the next card

// Vertical centre of a card by its position in the stack:
// s = -1 top slot, 0 bottom (current) slot, +1 entering from below.
const yForSlot = (s: number) =>
  interpolate(s, [-2, -1, 0, 1], [-320, 400, 990, 1700], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
const opacityForSlot = (s: number) =>
  interpolate(s, [-1.7, -1, 0, 0.7], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

export const sceneStarts = (p: ShortProps) => {
  const starts: number[] = [];
  let t = 0;
  for (const s of p.scenes) {
    starts.push(t);
    t += Math.round(s.seconds * FPS);
  }
  return { starts, ctaStart: t, total: t + Math.round(p.cta.seconds * FPS) };
};

const CardView: React.FC<{ card: Card }> = ({ card }) => {
  const dark = card.theme === "dark";
  const fg = dark ? brand.white : brand.navy;
  return (
    <div
      style={{
        width: CARD_W,
        height: CARD_H,
        borderRadius: 40,
        background: dark ? brand.navy : brand.white,
        border: `8px solid ${brand.white}`,
        boxShadow: "0 24px 60px rgba(17,25,44,0.16), 0 4px 12px rgba(17,25,44,0.08)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        fontFamily: brand.font,
        color: fg,
        boxSizing: "border-box",
      }}
    >
      {card.image ? (
        <Img src={staticFile(card.image)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <>
          {card.icon && (
            <Icon name={card.icon} size={card.label ? 170 : 240} color={brand.orange} glow={dark} />
          )}
          {card.label && (
            <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1, textAlign: "center", padding: "0 40px" }}>
              {card.label}
            </div>
          )}
          {card.sublabel && (
            <div style={{ fontSize: 36, fontWeight: 400, color: dark ? "#B8C0CC" : brand.muted, marginTop: -10 }}>
              {card.sublabel}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export const Short: React.FC<ShortProps> = (props) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { starts, ctaStart, total } = sceneStarts(props);
  const n = props.scenes.length;

  // Continuous stack position c: integer k while scene k is showing,
  // easing to k+1 during the transition. The CTA pushes the stack off screen.
  const boundaries = [...starts.slice(1), ctaStart];
  let c = 0;
  boundaries.forEach((b, k) => {
    const p = spring({ frame: frame - b, fps, durationInFrames: TRANSITION, config: { damping: 200 } });
    c += k === n - 1 ? p * 2.2 : p;
  });

  // While only the first card exists, centre it on screen.
  const firstBias = interpolate(c, [0, 1], [-290, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const intro = spring({ frame, fps, durationInFrames: 20, config: { damping: 200 } });

  const cardPos = props.scenes.map((_, k) => {
    const s = k - c;
    return { s, y: yForSlot(s) + firstBias, o: opacityForSlot(s) };
  });

  const ctaIn = spring({ frame: frame - ctaStart - 6, fps, durationInFrames: 22, config: { damping: 14 } });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: brand.offWhite,
        backgroundImage: "radial-gradient(rgba(17,25,44,0.07) 2px, transparent 2px)",
        backgroundSize: "44px 44px",
      }}
    >
      {props.voiceover && <Audio src={staticFile(props.voiceover)} />}
      {props.music && <Audio src={staticFile(props.music)} volume={0.12} />}

      {/* Connector lines between consecutive cards */}
      {cardPos.map((pos, k) => {
        if (k === 0) return null;
        const prev = cardPos[k - 1];
        const top = prev.y + CARD_H / 2;
        const bottom = pos.y - CARD_H / 2;
        const draw = interpolate(frame - starts[k], [4, 16], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const o = Math.min(prev.o, pos.o);
        if (o <= 0 || bottom <= top) return null;
        return (
          <div
            key={`line-${k}`}
            style={{
              position: "absolute",
              left: 540 - 4,
              top,
              width: 8,
              height: (bottom - top) * draw,
              background: brand.navy,
              borderRadius: 4,
              opacity: o,
            }}
          />
        );
      })}

      {/* Cards */}
      {props.scenes.map((scene, k) => {
        const { y, o } = cardPos[k];
        if (o <= 0) return null;
        const scale = k === 0 ? 0.85 + 0.15 * intro : 1;
        return (
          <div
            key={`card-${k}`}
            style={{
              position: "absolute",
              left: 540 - CARD_W / 2,
              top: y - CARD_H / 2,
              opacity: k === 0 ? o * intro : o,
              transform: `scale(${scale})`,
            }}
          >
            <CardView card={scene.card} />
          </div>
        );
      })}

      {/* Captions */}
      {props.scenes.map((scene, k) => {
        const dur = Math.round(scene.seconds * fps);
        return (
          <Sequence key={`cap-${k}`} from={starts[k]} durationInFrames={dur} layout="none">
            <CaptionBlock text={scene.caption} dur={dur} top={1290} />
          </Sequence>
        );
      })}

      {/* Call to action */}
      <Sequence from={ctaStart} durationInFrames={total - ctaStart} layout="none">
        <div style={{ position: "absolute", top: 230, width: "100%" }}>
          <Caption text={props.cta.above} revealFrames={18} fontSize={64} />
        </div>
        <Img
          src={staticFile("bizworx-circle-badge.png")}
          style={{
            position: "absolute",
            left: 540 - 230,
            top: 640,
            width: 460,
            opacity: ctaIn,
            transform: `scale(${0.6 + 0.4 * ctaIn})`,
          }}
        />
        <div style={{ position: "absolute", top: 1220, width: "100%" }}>
          <Sequence from={14} layout="none">
            <Caption text={props.cta.below} revealFrames={24} fontSize={64} />
          </Sequence>
        </div>
      </Sequence>

      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          width: "100%",
          textAlign: "center",
          fontFamily: brand.font,
          fontWeight: 700,
          fontSize: 64,
          letterSpacing: -1,
          color: brand.watermark,
        }}
      >
        {props.watermark}
      </div>
    </AbsoluteFill>
  );
};

const CaptionBlock: React.FC<{ text: string; dur: number; top: number }> = ({ text, dur, top }) => {
  const frame = useCurrentFrame();
  const out = interpolate(frame, [dur - 6, dur], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top, width: "100%", opacity: out }}>
      <Caption text={text} revealFrames={Math.round(dur * 0.6)} />
    </div>
  );
};
