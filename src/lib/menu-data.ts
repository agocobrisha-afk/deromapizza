export type MenuItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  sizeNote?: string;
  image?: string;
};

export type MenuCategory = {
  id: string;
  title: string;
  subtitle?: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "pastries",
    title: "المعجنات",
    subtitle: "كالزوني وباقيت محشو، يخرج طازج من الفرن",
    items: [
      {
        id: "calzone-mafroum",
        name: "كالازوني مفروم",
        description: "باستا، لحم مفروم، جبنة، خضرة، بطاطا مقلية",
        price: 22,
        image: "/images/pizza-beef.jpg",
      },
      {
        id: "mushta3ela-djaj",
        name: "مشتعلة دجاج",
        description: "دجاج مشوي بصوص السماق الحار، جبنة، بطاطا",
        price: 24,
      },
      {
        id: "maqlouba-djaj",
        name: "مقلوبة دجاج",
        description: "دجاج مشوي، قشطة، باركيسوس، جبنة",
        price: 18,
      },
      {
        id: "baguette-djaj",
        name: "باقيت دجاج",
        description: "دجاج متبل مع البطاطا العقنية والسلطة المشوية وجبنة وصوصات",
        price: 23,
      },
      {
        id: "calzone-djaj",
        name: "كالازوني دجاج",
        description: "دجاج متبل، جبنة، بطاطا، صوص",
        price: 22,
      },
      {
        id: "libani-djaj",
        name: "ليباني دجاج",
        description:
          "دجاج متبل مع البطاطا العقنية والسلطة المشوية وجبنة موزاريلا وزيت زيتون وشرائح بارميزان",
        price: 23,
      },
    ],
  },
  {
    id: "pizza",
    title: "بيتزا متوسطة",
    subtitle: "عجينة مخمّرة وجبنة موزاريلا تُخبز طازجة لطلبك",
    items: [
      {
        id: "margherita",
        name: "مارجيتا",
        description: "صلصة نابولي، جبنة موزاريلا، شيدر",
        price: 16,
        image: "/images/pizza-tomato-olive.jpg",
      },
      {
        id: "khudrawat",
        name: "بيتزا خضروات",
        description: "جبنة، فلفل حلو، بصل، طماطم أخضر، ذرة، زيتون",
        price: 17,
        image: "/images/pizza-veggie-corn.jpg",
      },
      {
        id: "house",
        name: "بيتزا هاوس",
        description: "صلصة نابولي، جبنة، تونة، زيتون قطاع، فلفل حلو",
        price: 18,
      },
      {
        id: "cheese-garlic",
        name: "بيتزا جبنة وثوم",
        description: "صوص ثوم، جبنة موزاريلا، زيت زيتون، زعتر",
        price: 16,
      },
      {
        id: "mawja-harra",
        name: "موجة حارة",
        description: "صلصة حارة، جبنة موزاريلا، فلفل مقلي، دجاج حار، بصل أحمر",
        price: 19,
        image: "/images/pizza-chicken-sauce.jpg",
      },
      {
        id: "smoky",
        name: "بيتزا سموكي",
        description: "صلصة طماطم، جبنة، فلفل حار أخضر، زيتون، باركيسوس",
        price: 20,
      },
      {
        id: "mexicana",
        name: "بيتزا مكسيكانا",
        description: "صلصة حارة، جبنة، فروم لحم، فلفل حار، بصل",
        price: 20,
      },
      {
        id: "meat-feast",
        name: "بيتزا ميت فيست",
        description: "صلصة، جبنة، كباب لحم، بصل، فلفل حار",
        price: 19,
      },
      {
        id: "funghi",
        name: "بيتزا فونقي",
        description: "صلصة، جبنة، فطر، زيتون، طماطم أخضر",
        price: 17,
        image: "/images/pizza-olives-pepper.jpg",
      },
      {
        id: "miami",
        name: "بيتزا ميامي",
        description: "صلصة، جبنة، دجاج، فقّاع، ذرة",
        price: 20,
        image: "/images/pizza-chicken.jpg",
      },
    ],
  },
  {
    id: "sides",
    title: "بطاطا ولازانيا",
    items: [
      { id: "fries-small", name: "بطاطا صغير", price: 6 },
      { id: "fries-large", name: "بطاطا كبير", price: 11 },
      {
        id: "lasagna",
        name: "لازانيا لحم",
        description: "طبقات باستا ولحم وجبنة مشوية بالفرن",
        price: 28,
        image: "/images/lasagna-cheesepull.jpg",
      },
    ],
  },
  {
    id: "extras",
    title: "الإضافات والمشروبات",
    items: [
      { id: "extra-cheese", name: "إضافة جبنة", price: 3 },
      { id: "extra-sauce", name: "إضافة صوص", price: 1 },
      { id: "soda", name: "مشروب غازي", price: 3 },
      { id: "water", name: "ماء", price: 1 },
    ],
  },
];

export const featuredIds = [
  "mawja-harra",
  "miami",
  "funghi",
  "lasagna",
  "margherita",
  "calzone-mafroum",
];

export function getFeaturedItems(): (MenuItem & { categoryTitle: string })[] {
  const result: (MenuItem & { categoryTitle: string })[] = [];
  for (const cat of menu) {
    for (const item of cat.items) {
      if (featuredIds.includes(item.id)) {
        result.push({ ...item, categoryTitle: cat.title });
      }
    }
  }
  return result;
}

export const restaurant = {
  nameAr: "دي روما",
  nameLat: "DE ROMA",
  tagline: "بيتزا ولازانيا إيطالية، تُخبز طازجة في بنغازي",
  phone1: "0944400150",
  phone2: "0944400151",
  whatsapp: "218944400150",
  address: "بنغازي، ليبيا",
  hours: "يوميًا · 1:00 ظهرًا — 1:00 صباحًا",
  prestoUrl: "#",
};
