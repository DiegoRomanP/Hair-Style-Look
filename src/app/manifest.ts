import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hair Style Look",
    short_name: "Hair Style Look",
    description: "Consulta capilar guiada para salones.",
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf8",
    theme_color: "#291b28",
    icons: [
      {
        src: "/icons/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
