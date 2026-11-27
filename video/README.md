# BizWorx Shorts template

Script in, branded vertical video out (1080x1920, 30 fps MP4). Built with [Remotion](https://www.remotion.dev/) (React → video).

Style: off-white dotted background, rounded cards joined by navy connector lines, word-by-word captions with bold/orange keywords, faint web address watermark, circle-badge call-to-action end screen.

## Make a video

```bash
cd video
npm install                                   # first time only
cp scripts/cash-flow-system.json scripts/my-topic.json   # edit it
npm run render -- scripts/my-topic.json       # -> out/my-topic.mp4
```

Preview and tweak live in the browser: `npm run studio`.

Check a few frames without a full render: `node render.mjs scripts/my-topic.json --stills --frames=30,150,400`

## Script format

```json
{
  "watermark": "bizworxfinancial.com",
  "voiceover": "vo/my-topic.mp3",
  "music": "music/bed.mp3",
  "scenes": [
    {
      "card": { "icon": "bank", "label": "Bank feed", "sublabel": "connected once", "theme": "light" },
      "caption": "here's the **system** we set up *instead*",
      "seconds": 3
    }
  ],
  "cta": { "above": "comment **CLARITY** ...", "below": "it only *goes* to ^^followers^^", "seconds": 4 }
}
```

- `voiceover` / `music` are optional files placed in `video/public/`. Match each scene's `seconds` to the voiceover.
- Card `theme`: `light` (white) or `dark` (navy with glowing orange icon; use it for the payoff card).
- Card `icon`: `invoice`, `receipt`, `bank`, `chart`, `check`, `calendar`, `dollar`, `alert`, `laptop`, `phone`, `clock`, `users`. Or use `"image": "file.png"` (in `public/`) for a screenshot or photo.
- Caption styles: `**bold**`, `*italic*`, `==orange==`, `^^BIG CAPS^^` (own line).

## Brand

Colors and font live in `src/theme.ts` (orange `#ED8A00`, navy `#11192C`, off-white `#F7F7F7`, Space Grotesk). Logos in `public/` come from the BizWorx Financial design system.

TODO: confirm the watermark web address in each script (`bizworxfinancial.com` is a placeholder).
