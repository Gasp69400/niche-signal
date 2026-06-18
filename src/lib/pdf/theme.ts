export const PDF = {
  pageW: 210,
  pageH: 297,
  margin: 18,
  ink: { r: 12, g: 14, b: 20 },
  muted: { r: 95, g: 100, b: 115 },
  paper: { r: 252, g: 252, b: 254 },
  accent: { r: 59, g: 130, b: 246 },
  accentSoft: { r: 219, g: 234, b: 254 },
  sky: { r: 56, g: 189, b: 248 },
  dark: { r: 5, g: 5, b: 8 },
  line: { r: 228, g: 230, b: 236 },
  success: { r: 16, g: 185, b: 129 },
  successSoft: { r: 209, g: 250, b: 229 },
  warning: { r: 245, g: 158, b: 11 },
  warningSoft: { r: 254, g: 243, b: 199 },
  white: { r: 255, g: 255, b: 255 },
} as const;

export function contentWidth() {
  return PDF.pageW - PDF.margin * 2;
}
