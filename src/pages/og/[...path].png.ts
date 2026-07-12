import type { APIRoute } from "astro";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { ogPages } from "../../lib/og-pages";

// Per-page OG endpoint. URLs look like /og/fr/features.png; the
// catch-all [...path] receives e.g. "fr/features". getStaticPaths
// emits one entry per page registered in src/lib/og-pages.ts.
//
// Layout matches the static og-default-{en,fr}.png shipped in
// cb36aee6: 1200x630, --catena-primary-900 background, lowercase
// "catena" wordmark in Conthrax-SemiBold + the page title beneath.

// Satori needs raw font bytes (not a CSS-bundled URL). Resolve the
// OTF from @catenahq/contracts at build time so the binary stays
// the single source of truth shared with the browser-side wordmark.
const fontPath = createRequire(import.meta.url).resolve(
  "@catenahq/contracts/brand/assets/conthrax-semibold.otf",
);
const fontData = readFileSync(fontPath);

const BG = "#0b223b";
const FG = "#ffffff";
const MUTED = "#a7c5e9";

export function getStaticPaths() {
  return ogPages.map((page) => ({
    params: { path: `${page.locale}/${page.subpath}` },
    props: { title: page.title, locale: page.locale },
  }));
}

interface Props {
  title: string;
  locale: "en" | "fr";
}

export const GET: APIRoute<Props> = async ({ props }) => {
  const { title, locale } = props;

  const card = {
    type: "div",
    props: {
      style: {
        width: "1200px",
        height: "630px",
        background: BG,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        fontFamily: "Conthrax",
      },
      children: [
        {
          type: "div",
          props: {
            style: {
              fontSize: "180px",
              color: FG,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              marginBottom: "40px",
            },
            children: "catena",
          },
        },
        {
          type: "div",
          props: {
            style: {
              fontSize: "64px",
              color: MUTED,
              lineHeight: 1.2,
            },
            children: title,
          },
        },
        {
          type: "div",
          props: {
            style: {
              marginTop: "auto",
              fontSize: "28px",
              color: MUTED,
              opacity: 0.7,
            },
            children: locale === "fr" ? "catena.run" : "catena.run",
          },
        },
      ],
    },
  };

  const svg = await satori(card as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Conthrax", data: fontData, weight: 600, style: "normal" },
    ],
  });

  const png = new Resvg(svg).render().asPng();

  return new Response(new Uint8Array(png), {
    headers: { "Content-Type": "image/png" },
  });
};
