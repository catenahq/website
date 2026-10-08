import type { HTMLAttributes } from "astro/types";

export interface CallToAction extends Omit<HTMLAttributes<"a">, "slot"> {
  variant?: "primary" | "secondary" | "tertiary" | "link";
  text?: string;
  icon?: string;
  type?: "button" | "submit" | "reset";
}

export interface Widget {
  id?: string;
  classes?: Record<string, string | Record<string, string>>;
}

export interface Headline {
  title?: string;
  subtitle?: string;
  tagline?: string;
  classes?: Record<string, string>;
}

export interface Item {
  title?: string;
  description?: string;
  icon?: string;
}

export interface Link {
  text: string;
  href: string;
  ariaLabel?: string;
  icon?: string;
}

/** Grid columns for a list of `columns` items per row on wide screens. */
export const getColumnsClass = (columns?: number): string =>
  columns === 4
    ? "lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2"
    : columns === 3
      ? "lg:grid-cols-3 sm:grid-cols-2"
      : columns === 2
        ? "sm:grid-cols-2"
        : "";
