// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import "./src/styles/global.css";

import tailwind from "@astrojs/tailwind";

import netlify from "@astrojs/netlify";

export default defineConfig({
  integrations: [react(), tailwind()],
  adapter: netlify(),
});