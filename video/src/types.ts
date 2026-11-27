export type IconName =
  | "invoice"
  | "bank"
  | "chart"
  | "check"
  | "calendar"
  | "dollar"
  | "alert"
  | "laptop"
  | "phone"
  | "clock"
  | "receipt"
  | "users";

export type Card = {
  /** Built-in icon. Use either icon or image. */
  icon?: IconName;
  /** File in video/public/ (PNG/JPG), e.g. "screenshot.png". */
  image?: string;
  /** Big text on the card. */
  label?: string;
  /** Smaller text under the label. */
  sublabel?: string;
  /** light = white card, dark = navy card with orange glow accent. */
  theme?: "light" | "dark";
};

export type Scene = {
  card: Card;
  /**
   * Caption with inline styles:
   *   **bold**   *italic*   ==orange==   ^^BIG CAPS^^
   */
  caption: string;
  seconds: number;
};

export type Cta = {
  /** Text above the badge, same inline styles as captions. */
  above: string;
  /** Text below the badge. */
  below: string;
  seconds: number;
};

export type ShortProps = {
  /** Faint text at the bottom of every frame. */
  watermark: string;
  /** Optional voiceover file in video/public/, e.g. "vo/cash-flow.mp3". */
  voiceover?: string;
  /** Optional music bed in video/public/. Played at low volume. */
  music?: string;
  scenes: Scene[];
  cta: Cta;
};
