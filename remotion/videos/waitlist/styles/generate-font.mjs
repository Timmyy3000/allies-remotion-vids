import fs from "fs";
import path from "path";

const boldPath = path.resolve("public/fonts/OpenRunde-Bold.woff2");
const boldBase64 = fs.readFileSync(boldPath).toString("base64");

const semiboldPath = path.resolve("public/fonts/OpenRunde-Semibold.woff2");
const semiboldBase64 = fs.readFileSync(semiboldPath).toString("base64");

const mediumPath = path.resolve("public/fonts/OpenRunde-Medium.woff2");
const mediumBase64 = fs.readFileSync(mediumPath).toString("base64");

const regularPath = path.resolve("public/fonts/OpenRunde-Regular.woff2");
const regularBase64 = fs.readFileSync(regularPath).toString("base64");

const content = `export const FONT_STYLE = \`
@font-face {
  font-family: "OpenRunde";
  src: url("data:font/woff2;base64,${boldBase64}") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "OpenRunde";
  src: url("data:font/woff2;base64,${semiboldBase64}") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "OpenRunde";
  src: url("data:font/woff2;base64,${mediumBase64}") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "OpenRunde";
  src: url("data:font/woff2;base64,${regularBase64}") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "SF Pro Rounded";
  src: url("data:font/woff2;base64,${boldBase64}") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "SF Pro Rounded";
  src: url("data:font/woff2;base64,${semiboldBase64}") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "SF Pro Rounded";
  src: url("data:font/woff2;base64,${mediumBase64}") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: block;
}

@font-face {
  font-family: "SF Pro Rounded";
  src: url("data:font/woff2;base64,${regularBase64}") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: block;
}
\`;
`;

fs.mkdirSync("remotion/videos/waitlist/styles", { recursive: true });
fs.writeFileSync("remotion/videos/waitlist/styles/font.ts", content);
console.log("Successfully generated remotion/videos/waitlist/styles/font.ts from OpenRunde-1.0.1.zip assets");
