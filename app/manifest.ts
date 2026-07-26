import type { MetadataRoute } from "next";

/** PWA-манифест (ТЗ A.2 E10). Иконки — favicon.ico (комплект PNG — TBD дизайн). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Hit Ceramics — клинкерные ступени и керамогранит",
    short_name: "Hit Ceramics",
    description:
      "Клинкерные ступени и крупноформатный керамогранит 20 мм для крыльца, лестниц и террас.",
    start_url: ".",
    display: "standalone",
    background_color: "#f3f1ec",
    theme_color: "#b8481f",
    lang: "ru",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
