export type HeroStyle = "cinematic-full" | "split-modern" | "minimal-centered";
export type CardStyle = "bento" | "grid" | "list-editorial";
export type FontPairing = "bold" | "elegant" | "minimal";

export type ThemePreset = {
  id: string;
  name: string;
  description: string;
  colors: {
    bg: string;
    surface: string;
    ink: string;
    inkSoft: string;
    inkFaint: string;
    accent: string;
    accentDark: string;
    accentTint: string;
    dark: string;
    darkSoft: string;
  };
  fontPairing: FontPairing;
  heroStyle: HeroStyle;
  cardStyle: CardStyle;
};

export const themePresets: ThemePreset[] = [
  {
    id: "bold-red",
    name: "أحمر جريء",
    description: "حيوي وواثق — مثالي لعلامة توصيل سريعة وحديثة",
    colors: {
      bg: "#FBFAF6", surface: "#FFFFFF", ink: "#181614", inkSoft: "#5B564E", inkFaint: "#948E84",
      accent: "#E63C2F", accentDark: "#C72E22", accentTint: "#FDEBE9",
      dark: "#181614", darkSoft: "#302C27",
    },
    fontPairing: "bold",
    heroStyle: "cinematic-full",
    cardStyle: "bento",
  },
  {
    id: "midnight-luxe",
    name: "ليلي فاخر",
    description: "هادئ وراقي بذهبي دافئ — لمطعم إيطالي أصيل",
    colors: {
      bg: "#0E0E10", surface: "#171719", ink: "#F4F1EA", inkSoft: "#C9C3B6", inkFaint: "#8F897F",
      accent: "#C89B3C", accentDark: "#A87F2C", accentTint: "#2A2419",
      dark: "#08080A", darkSoft: "#171719",
    },
    fontPairing: "elegant",
    heroStyle: "cinematic-full",
    cardStyle: "list-editorial",
  },
  {
    id: "fresh-green",
    name: "أخضر طبيعي",
    description: "منعش وودود — يبرز الطازج والمكونات الطبيعية",
    colors: {
      bg: "#F8FAF3", surface: "#FFFFFF", ink: "#1B2318", inkSoft: "#586B4E", inkFaint: "#8FA184",
      accent: "#4B7C3F", accentDark: "#3A6130", accentTint: "#E7F1DF",
      dark: "#1B2318", darkSoft: "#2B3624",
    },
    fontPairing: "bold",
    heroStyle: "cinematic-full",
    cardStyle: "grid",
  },
  {
    id: "classic-blue",
    name: "أزرق كلاسيكي",
    description: "رسمي وموثوق — لمطعم فاين داينينج",
    colors: {
      bg: "#F7F8FA", surface: "#FFFFFF", ink: "#101826", inkSoft: "#4C5A6E", inkFaint: "#8B95A5",
      accent: "#1D4E89", accentDark: "#153A66", accentTint: "#E4EBF4",
      dark: "#0C1420", darkSoft: "#18243A",
    },
    fontPairing: "elegant",
    heroStyle: "cinematic-full",
    cardStyle: "grid",
  },
  {
    id: "modern-blush",
    name: "وردي عصري",
    description: "شبابي وحديث — يناسب كافيه أو بيتزا كاجوال",
    colors: {
      bg: "#FDF7F6", surface: "#FFFFFF", ink: "#241A19", inkSoft: "#6B5250", inkFaint: "#A6898A",
      accent: "#D64C6F", accentDark: "#B23857", accentTint: "#FBE6EC",
      dark: "#241A19", darkSoft: "#382524",
    },
    fontPairing: "bold",
    heroStyle: "cinematic-full",
    cardStyle: "bento",
  },
  {
    id: "artisan-brown",
    name: "بنّي حرفي",
    description: "دافئ وحرفي — إحساس مخبز إيطالي تقليدي",
    colors: {
      bg: "#FAF4EC", surface: "#FFFFFF", ink: "#2E2013", inkSoft: "#6B5A45", inkFaint: "#A5947E",
      accent: "#9C5A2E", accentDark: "#7A4522", accentTint: "#F3E4D3",
      dark: "#241A10", darkSoft: "#3A2B1B",
    },
    fontPairing: "elegant",
    heroStyle: "cinematic-full",
    cardStyle: "list-editorial",
  },
  {
    id: "sleek-black",
    name: "أسود أنيق",
    description: "جريء وحاد — لعلامة بريميوم مودرن",
    colors: {
      bg: "#0A0A0A", surface: "#141414", ink: "#FAFAFA", inkSoft: "#B4B4B4", inkFaint: "#787878",
      accent: "#FF3B30", accentDark: "#D42A20", accentTint: "#2A1412",
      dark: "#000000", darkSoft: "#141414",
    },
    fontPairing: "minimal",
    heroStyle: "cinematic-full",
    cardStyle: "grid",
  },
  {
    id: "vivid-orange",
    name: "برتقالي حيوي",
    description: "طاقة عالية — مثالي لفاست فود عصري",
    colors: {
      bg: "#FFFAF3", surface: "#FFFFFF", ink: "#231A0E", inkSoft: "#6B5A42", inkFaint: "#A5937A",
      accent: "#F07B1E", accentDark: "#C96313", accentTint: "#FDEBD6",
      dark: "#231A0E", darkSoft: "#382A17",
    },
    fontPairing: "bold",
    heroStyle: "cinematic-full",
    cardStyle: "grid",
  },
  {
    id: "royal-purple",
    name: "بنفسجي ملكي",
    description: "فخم ومميز — لتجربة بيتزا لاونج راقية",
    colors: {
      bg: "#FAF7FB", surface: "#FFFFFF", ink: "#1E1526", inkSoft: "#5C4E68", inkFaint: "#9686A3",
      accent: "#6B3FA0", accentDark: "#532F7E", accentTint: "#EEE4F5",
      dark: "#181022", darkSoft: "#281C36",
    },
    fontPairing: "elegant",
    heroStyle: "cinematic-full",
    cardStyle: "bento",
  },
  {
    id: "minimal-grey",
    name: "رمادي مينيمال",
    description: "نظيف وبسيط — إحساس إسكندنافي هادئ",
    colors: {
      bg: "#FAFAFA", surface: "#FFFFFF", ink: "#161616", inkSoft: "#5E5E5E", inkFaint: "#9B9B9B",
      accent: "#161616", accentDark: "#000000", accentTint: "#EDEDED",
      dark: "#161616", darkSoft: "#262626",
    },
    fontPairing: "minimal",
    heroStyle: "cinematic-full",
    cardStyle: "grid",
  },
];

export function getThemePreset(id: string | null | undefined): ThemePreset {
  return themePresets.find((t) => t.id === id) ?? themePresets[0];
}
