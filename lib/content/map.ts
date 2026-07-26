/** Объекты для карты (ТЗ §6 блок 13, §11.3). Управляются из CMS. */

export interface MapObject {
  id: string;
  city: string;
  /** Тип для фильтра карты. */
  type: "steps" | "terrace";
  brand: string;
  article: string;
  year: number;
  photo: string;
  coords: [number, number];
}

export const MAP_OBJECTS: MapObject[] = [
  { id: "o1", city: "Москва", type: "steps", brand: "Paradyz", article: "Taurus Brown", year: 2024, photo: "/images/gal-porch.jpg", coords: [55.751, 37.618] },
  { id: "o2", city: "Санкт-Петербург", type: "terrace", brand: "Stroeher", article: "Aera Beige", year: 2025, photo: "/images/gal-terrace.jpg", coords: [59.939, 30.315] },
  { id: "o3", city: "Московская обл.", type: "steps", brand: "Stroeher", article: "Keraplatte Roccia", year: 2023, photo: "/images/gal-stairs.jpg", coords: [55.83, 37.45] },
  { id: "o4", city: "Ленинградская обл.", type: "terrace", brand: "Interbau", article: "Wood Oak", year: 2025, photo: "/images/gal-decking.jpg", coords: [59.7, 30.4] },
  { id: "o5", city: "Тверь", type: "terrace", brand: "Exagres", article: "Quarz Grafito", year: 2024, photo: "/images/gal-path.jpg", coords: [56.859, 35.912] },
  { id: "o6", city: "Москва", type: "steps", brand: "Westerwälder Klinker", article: "Stahl Антрацит", year: 2024, photo: "/images/cat-clinker.jpg", coords: [55.7, 37.7] },
];
