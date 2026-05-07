/**
 * Type declarations for @catena/i18n. Source is JS so consumers
 * (Astro, Next, Starlight) get types without us porting the runtime
 * to TS.
 */
export type Locale = "en" | "fr";

export const locales: readonly Locale[];
export const defaultLocale: Locale;

export interface CommonBundle {
  brand: { name: string; tagline: string };
  nav: Record<string, string>;
  cta: Record<string, string>;
  footer: Record<string, string>;
  lang: Record<string, string>;
}

export interface ErrorsBundle {
  generic: Record<string, string>;
  form: Record<string, string>;
  auth: Record<string, string>;
}

export interface FullBundle {
  common: CommonBundle;
  errors: ErrorsBundle;
}

export function bundle(locale: string): FullBundle;
export function t(locale: string, key: string): string;
export function tArray(locale: string, key: string): string[];
