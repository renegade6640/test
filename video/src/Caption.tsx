import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { brand } from "./theme";

type Style = "plain" | "bold" | "italic" | "orange" | "caps";
type Word = { text: string; style: Style } | { br: true };

// Markup: **bold**  *italic*  ==orange==  ^^BIG CAPS^^ (own line)
export function parseCaption(src: string): Word[] {
  const parts = src.split(/(\*\*.+?\*\*|==.+?==|\^\^.+?\^\^|\*.+?\*)/g).filter(Boolean);
  const words: Word[] = [];
  for (const part of parts) {
    let style: Style = "plain";
    let text = part;
    if (part.startsWith("**")) [style, text] = ["bold", part.slice(2, -2)];
    else if (part.startsWith("==")) [style, text] = ["orange", part.slice(2, -2)];
    else if (part.startsWith("^^")) [style, text] = ["caps", part.slice(2, -2).toUpperCase()];
    else if (part.startsWith("*")) [style, text] = ["italic", part.slice(1, -1)];
    if (style === "caps") words.push({ br: true });
    for (const w of text.split(/\s+/).filter(Boolean)) words.push({ text: w, style });
    if (style === "caps") words.push({ br: true });
  }
  return words;
}

const styleFor = (s: Style): React.CSSProperties => {
  switch (s) {
    case "bold":
      return { fontWeight: 700, fontSize: 76 };
    case "italic":
      return { fontWeight: 500, fontStyle: "italic" };
    case "orange":
      return { fontWeight: 700, fontSize: 76, color: brand.orange };
    case "caps":
      return { fontWeight: 700, fontSize: 112, letterSpacing: -1, lineHeight: 1.05 };
    default:
      return { fontWeight: 400 };
  }
};

/**
 * Reveals words one by one over `revealFrames`, InsiderForce-style:
 * light running text with heavy keywords.
 */
export const Caption: React.FC<{ text: string; revealFrames: number; fontSize?: number }> = ({
  text,
  revealFrames,
  fontSize = 60,
}) => {
  const frame = useCurrentFrame();
  const words = parseCaption(text);
  const count = words.filter((w) => !("br" in w)).length;
  let i = -1;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "baseline",
        columnGap: 18,
        rowGap: 4,
        fontFamily: brand.font,
        fontSize,
        color: brand.text,
        lineHeight: 1.2,
        textAlign: "center",
        padding: "0 70px",
      }}
    >
      {words.map((w, k) => {
        if ("br" in w) return <div key={k} style={{ flexBasis: "100%", height: 0 }} />;
        i++;
        const start = (i / Math.max(count, 1)) * revealFrames;
        const t = interpolate(frame, [start, start + 5], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <span
            key={k}
            style={{
              ...styleFor(w.style),
              opacity: t,
              transform: `translateY(${(1 - t) * 18}px)`,
              display: "inline-block",
            }}
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
};
