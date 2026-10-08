// Edition prices, read from the Polar products at build time.
//
// Each paid edition is one active, monthly, recurring Polar product carrying
// the metadata catena_edition=pro or catena_edition=business, with one fixed
// price per currency the site offers. POLAR_PRODUCTS_TOKEN is an organization
// access token with the products:read scope only. A CI build fails when the
// token, a product or a price is missing; a local build without a token
// renders the editions with no amount.
import { CI, POLAR_API_BASE, POLAR_PRODUCTS_TOKEN } from "astro:env/server";

export const CURRENCIES = ["cad", "usd"] as const;
export type Currency = (typeof CURRENCIES)[number];
export type Edition = "pro" | "business";
/** Monthly price in cents, per edition and currency. */
export type EditionPrices = Record<Edition, Record<Currency, number>>;

const EDITIONS: Edition[] = ["pro", "business"];

interface PolarPrice {
  amount_type: string;
  price_currency: string;
  price_amount?: number;
  is_archived: boolean;
}

interface PolarProduct {
  name: string;
  recurring_interval: string | null;
  metadata: Record<string, unknown>;
  prices: PolarPrice[];
}

async function fetchPrices(): Promise<EditionPrices | null> {
  if (!POLAR_PRODUCTS_TOKEN) {
    if (CI) throw new Error("polar-prices: POLAR_PRODUCTS_TOKEN is not set; the edition prices come from Polar");
    console.warn("polar-prices: POLAR_PRODUCTS_TOKEN is not set; the editions render without prices");
    return null;
  }

  const url = new URL("/v1/products/", POLAR_API_BASE);
  url.searchParams.set("is_archived", "false");
  url.searchParams.set("is_recurring", "true");
  url.searchParams.set("limit", "100");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${POLAR_PRODUCTS_TOKEN}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`polar-prices: ${url} answered ${res.status}: ${await res.text()}`);
  const { items } = (await res.json()) as { items: PolarProduct[] };

  const prices = {} as EditionPrices;
  for (const edition of EDITIONS) {
    const products = items.filter((p) => p.metadata?.catena_edition === edition);
    if (products.length !== 1) {
      throw new Error(
        `polar-prices: want one active recurring product with metadata catena_edition=${edition}, found ${products.length}`,
      );
    }
    const product = products[0];
    if (product.recurring_interval !== "month") {
      throw new Error(`polar-prices: ${product.name} renews every ${product.recurring_interval}, not every month`);
    }
    prices[edition] = {} as Record<Currency, number>;
    for (const currency of CURRENCIES) {
      const price = product.prices.find(
        (p) => !p.is_archived && p.amount_type === "fixed" && p.price_currency === currency,
      );
      if (price?.price_amount === undefined) {
        throw new Error(`polar-prices: ${product.name} has no fixed ${currency.toUpperCase()} price`);
      }
      prices[edition][currency] = price.price_amount;
    }
  }
  return prices;
}

// One request per build, shared by every page that renders a price.
let cached: Promise<EditionPrices | null> | undefined;
export const editionPrices = () => (cached ??= fetchPrices());
