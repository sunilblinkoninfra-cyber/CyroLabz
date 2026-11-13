import React from "react";
import type { Metadata } from "next";
import { Archivo, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import { ReimagineMonograph } from "@/components/reimagine/ReimagineMonograph";
import "./reimagine.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--rg-font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--rg-font-serif",
  display: "swap",
  weight: ["400", "500", "600"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--rg-font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Reimagined Design Statement — Exposed-Spine Engineering Monograph",
  description:
    "Interactive demonstration reimagining Cyrolabz's transformation design statement using pbakaus/impeccable.",
};

export default function ReimaginePage() {
  return (
    <div
      className={`${archivo.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <ReimagineMonograph />
    </div>
  );
}

