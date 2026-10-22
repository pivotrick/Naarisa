import { create } from "zustand";
import axios from "axios";
import { BASE, CATEGORY } from "../Constants/apiRoutes.js";
import coOrdBanner from "../assets/co-ord-banner.webp";

const TILE_IMAGES = "https://ik.imagekit.io/llcblwlng/naarisa/homepage-banners";

// Shown until the API answers, and kept if it can't be reached, so the menu is never empty.
// `name` is the value stored on products; `label` is what customers see.
export const DEFAULT_CATEGORIES = [
  { name: "Short Kurti", label: "Short Kurtis", slug: "short-kurtis", tagline: "Chic, versatile and effortlessly yours.", image: `${TILE_IMAGES}/Short%20Kurtis%20Banner.png`, badge: "", showOnHome: true },
  { name: "Long Kurti", label: "Long Kurtis", slug: "long-kurtis", tagline: "Timeless silhouettes. Effortless elegance.", image: `${TILE_IMAGES}/Long%20Kurtis%20Banner.png`, badge: "", showOnHome: true },
  { name: "Dresses", label: "Dresses", slug: "dresses", tagline: "Flowy silhouettes, timeless prints and elegance in every detail.", image: `${TILE_IMAGES}/Dresses%20Banner.png`, badge: "", showOnHome: true },
  { name: "Kurti Sets", label: "Kurti Sets", slug: "kurti-sets", tagline: "Complete ensembles. Grace in every detail.", image: `${TILE_IMAGES}/Kurti%20Set%20Banner.png`, badge: "", showOnHome: true },
  { name: "Co-ord Sets", label: "Co-ord Sets", slug: "co-ord-sets", tagline: "Perfectly matched. Effortlessly put together.", image: coOrdBanner, badge: "", showOnHome: true },
];

const FALLBACK_IMAGES = Object.fromEntries(DEFAULT_CATEGORIES.map((c) => [c.slug, c.image]));

const fromApi = (c) => ({
  name: c.name,
  label: c.label || c.name,
  slug: c.slug,
  tagline: c.tagline || "",
  image: c.image?.url || FALLBACK_IMAGES[c.slug] || null,
  badge: c.badge || "",
  showOnHome: c.showOnHome !== false,
});

const useCategoryStore = create((set, get) => ({
  categories: DEFAULT_CATEGORIES,
  loaded: false,

  fetchCategories: async () => {
    if (get().loaded) return;
    try {
      const res = await axios.get(`${BASE.ROUTE}${CATEGORY.LIST}`);
      if (res.data?.success && Array.isArray(res.data.data)) {
        set({ categories: res.data.data.map(fromApi) });
      }
    } catch (err) {
      console.error("Failed to load categories, using defaults:", err);
    } finally {
      set({ loaded: true });
    }
  },
}));

export const categoryPath = (category) => `/categories/${category.slug}`;

export default useCategoryStore;
