// Usage: npm run render -- scripts/<name>.json   ->  out/<name>.mp4
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition, renderStill } from "@remotion/renderer";
import fs from "node:fs";
import path from "node:path";

const scriptPath = process.argv[2] ?? "scripts/cash-flow-system.json";
const stills = process.argv.includes("--stills");
const inputProps = JSON.parse(fs.readFileSync(scriptPath, "utf8"));
const name = path.basename(scriptPath, ".json");

// Use a locally installed Chrome if one is set or present; otherwise Remotion downloads its own.
const candidates = [
  process.env.REMOTION_CHROME,
  "/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell",
].filter(Boolean);
const browserExecutable = candidates.find((p) => fs.existsSync(p)) ?? null;

const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: "Short", inputProps, browserExecutable });
fs.mkdirSync("out", { recursive: true });

if (stills) {
  const frames = (process.argv.find((a) => a.startsWith("--frames=")) ?? "--frames=30,120").slice(9).split(",").map(Number);
  for (const f of frames) {
    await renderStill({ serveUrl, composition, inputProps, frame: f, output: `out/${name}-${f}.png`, browserExecutable });
    console.log(`out/${name}-${f}.png`);
  }
} else {
  const outputLocation = `out/${name}.mp4`;
  let lastPct = -1;
  await renderMedia({
    serveUrl,
    composition,
    inputProps,
    codec: "h264",
    outputLocation,
    browserExecutable,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 10) * 10;
      if (pct !== lastPct) console.log(`Rendering ${(lastPct = pct)}%`);
    },
  });
  console.log(`\nDone: ${outputLocation}`);
}
