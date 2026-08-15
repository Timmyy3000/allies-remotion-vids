export const ALLY_COLORS = {
  blue: "#3446E9",
  green: "#12C25B",
  yellow: "#FBE65F",
  pink: "#FD304F",
} as const;

export const COLORS = {
  background: "#FFFFFF",
  headlineText: "#121212",
  brandOrange: "#FF5800",
  ...ALLY_COLORS,
} as const;

