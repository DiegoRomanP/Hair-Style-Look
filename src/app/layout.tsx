import type { Metadata, Viewport } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Hair Style Look",
  description: "Consulta capilar guiada para salones.",
  applicationName: "Hair Style Look",
};

export const viewport: Viewport = {
  themeColor: "#291b28",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
