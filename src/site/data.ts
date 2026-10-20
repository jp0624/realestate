import source from "./properties.json";
export interface Property {
  id: string;
  slug: string;
  address: string;
  city: string;
  province: string;
  neighbourhood: string;
  type: string;
  beds: number;
  baths: number;
  sqft: number;
  parking: number;
  price: number;
  status: string;
  daysListed: number;
  featured: boolean;
  headline: string;
  description: string;
  highlights: string[];
  coords: { lat: number; lng: number };
  images: string[];
  imageLabels: string[];
  rooms: { name: string; dimensions: string }[];
  fees: number;
  taxes: number;
  demo: boolean;
}
export const properties = source as Property[];
export const money = (n: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
export const priceLabel = (p: Property) =>
  money(p.price) + (p.status === "For lease" ? " / mo" : "");
export interface Filters {
  query: string;
  type: string;
  status: string;
  minBeds: number;
  minPrice: number;
  maxPrice: number;
  savedOnly: boolean;
}
export const initialFilters: Filters = {
  query: "",
  type: "All types",
  status: "For sale",
  minBeds: 0,
  minPrice: 0,
  maxPrice: 0,
  savedOnly: false,
};
export function filterHomes(
  data: Property[],
  f: Filters,
  saved: string[] = [],
) {
  const terms = f.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return data.filter(
    (p) =>
      terms.every((t) =>
        `${p.address} ${p.city} ${p.neighbourhood} ${p.type}`
          .toLowerCase()
          .includes(t),
      ) &&
      (f.type === "All types" || p.type === f.type) &&
      (f.status === "All listings" || p.status === f.status) &&
      p.beds >= f.minBeds &&
      p.price >= f.minPrice &&
      (!f.maxPrice || p.price <= f.maxPrice) &&
      (!f.savedOnly || saved.includes(p.id)),
  );
}
/** Canadian fixed-rate convention: nominal rate compounded semi-annually. */
export function mortgagePayment(
  principal: number,
  annualRate: number,
  years: number,
) {
  if (principal <= 0 || years <= 0) return 0;
  const monthly = Math.pow(1 + annualRate / 200, 1 / 6) - 1;
  const n = years * 12;
  return monthly === 0
    ? principal / n
    : (principal * monthly) / (1 - Math.pow(1 + monthly, -n));
}
export function readStored<T>(key: string, fallback: T): T {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? "null");
    return value === null ? fallback : value;
  } catch {
    return fallback;
  }
}
