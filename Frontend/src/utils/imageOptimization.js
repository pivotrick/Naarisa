// ─── ImageKit URL helpers ───────────────────────────────────────────────
// NOTE: these build the `tr=` transform block explicitly instead of
// regex-substituting into whatever transform is already on the URL.
// Do not go back to /w_\d+/-style regex patching — it silently breaks
// the moment the backend emits hyphen syntax (w-500 instead of w_500),
// because the pattern simply stops matching and every srcSet entry
// collapses to the same URL. See P0.5 / §5 of the audit.

const withTransform = (url, transformation) => {
  if (!url) return url;
  const base = url.split("?")[0]; // ImageKit URLs here only ever carry the tr= param
  return `${base}?tr=${transformation}`;
};

export const buildImageUrls = (url) => {
  if (!url) return {};

  return {
    url,

    thumbnail: withTransform(url, "w-150,f-auto,q-70"),

    // Widened to 500/800/1400 to match the new PDP base width (w-1400)
    // set on the backend in getProductBySlugService.js.
    srcSet: `
      ${withTransform(url, "w-500,f-auto,q-75")} 500w,
      ${withTransform(url, "w-800,f-auto,q-75")} 800w,
      ${withTransform(url, "w-1400,f-auto,q-80")} 1400w
    `.trim(),

    sizes: "(max-width:640px) 100vw, (max-width:1024px) 50vw, 45vw",
  };
};

// An ImageKit image resized to roughly the size it is displayed at, in WebP/AVIF.
// Anything else (e.g. images bundled with the site) is returned unchanged.
export const ikImage = (url, width, quality = 75) =>
  url && url.includes("ik.imagekit.io") ? withTransform(url, `w-${width},f-auto,q-${quality}`) : url;

// Generate a real LQIP image (not SVG) — matches the preset in §7 of the audit.
export const generateLQIPUrl = (url) => {
  if (!url) return "";
  return withTransform(url, "w-20,bl-30,f-auto,q-20");
};