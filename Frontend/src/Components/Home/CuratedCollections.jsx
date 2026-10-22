import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useInView from "../../utils/useInView.js";
import { ikImage } from "../../utils/imageOptimization.js";
import useCategoryStore, { categoryPath } from "../../Store/useCategoryStore.js";

const CuratedCollections = () => {
  // Tiles come from the admin-managed categories ("Show on home page")
  const categories = useCategoryStore((s) => s.categories);
  const collections = categories
    .filter((c) => c.showOnHome)
    .map((c) => ({ title: c.label, path: categoryPath(c), image: c.image, tagline: c.tagline, badge: c.badge }));
  const header = useInView();
  const [headerAnimated, setHeaderAnimated] = useState(false);

  useEffect(() => {
    if (header.inView) setHeaderAnimated(true);
  }, [header.inView]);

  return (
    <section
      className="w-full overflow-hidden px-4 py-8 sm:px-6 sm:py-8 md:px-10 md:py-10 xl:px-12"
      style={{ backgroundColor: "#F9F3EB" }}
    >
      {/* Section Header */}
      <div
        ref={header.ref}
        className="mb-8 text-center transition-all duration-500 sm:mb-10"
        style={{
          opacity: headerAnimated ? 1 : 0,
          transform: headerAnimated ? "translateY(0)" : "translateY(10px)",
        }}
      >
        <p
          className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: "'Jost', sans-serif", color: "#C47B1E" }}
        >
          Explore
        </p>

        <h2
          className="text-[28px] font-normal italic sm:text-[36px] md:text-[40px]"
          style={{ fontFamily: "'EB Garamond', serif", color: "#1f1b15" }}
        >
          Curated Collections
        </h2>
      </div>

      {/* 2x2 Grid */}
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {collections.map((col, index) => (
          <AnimatedCard
            key={col.title}
            col={col}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

const AnimatedCard = ({ col, index }) => {
  const { ref, inView } = useInView();
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (inView && !animated) {
      const raf = requestAnimationFrame(() => setAnimated(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [inView, animated]);

  const delays = [0, 80, 80, 160, 240];

  return (
    <div
      ref={ref}
      className="w-full transition-all duration-300"
      style={{
        opacity: animated ? 1 : 0,
        transform: animated ? "translateY(0) scale(1)" : "translateY(12px) scale(0.99)",
        transitionDelay: `${delays[index] || 0}ms`,
      }}
    >
      <Link
        to={col.path}
        className="group relative block w-full overflow-hidden"
        style={{ aspectRatio: "4/3" }}
      >
        {col.image ? (
          <img
            src={ikImage(col.image, 800)}
            alt={col.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-400 group-hover:scale-105"
          />
        ) : (
          // No tile image uploaded yet: text tile in the brand palette
          <div
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center transition-transform duration-400 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #2B2112 0%, #4A3728 60%, #AB721E 140%)" }}
          >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "'Jost', sans-serif", color: "#C4A882" }}>
              Collection
            </p>
            <h3 className="text-[34px] italic leading-tight sm:text-[42px]" style={{ fontFamily: "'EB Garamond', serif", color: "#F5E6D0" }}>
              {col.title}
            </h3>
            {col.tagline && (
              <p className="mt-2 max-w-[320px] text-[13px]" style={{ fontFamily: "'Jost', sans-serif", color: "#C4A882" }}>
                {col.tagline}
              </p>
            )}
            <span className="mt-5 border-b pb-1 text-[11px] font-semibold uppercase tracking-[0.16em]" style={{ fontFamily: "'Jost', sans-serif", color: "#F5E6D0", borderColor: "#AB721E" }}>
              Shop now
            </span>
          </div>
        )}
        {col.badge && (
          <span
            className="absolute left-3 top-3 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-white"
            style={{ fontFamily: "'Jost', sans-serif", backgroundColor: "#AB721E" }}
          >
            {col.badge}
          </span>
        )}
        <div className="absolute inset-0 border border-transparent transition-all duration-500 group-hover:border-white/20" />
      </Link>
    </div>
  );
};

export default CuratedCollections;