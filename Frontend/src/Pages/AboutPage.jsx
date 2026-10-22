import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useInView from "../utils/useInView.js";
import shortkurtibanner from "../assets/about-short-kurtis.webp";
import longkurtibanner from "../assets/about-long-kurtis.webp";
import dressesbanner from "../assets/about-dresses.webp";
import kurtisetbanner from "../assets/about-kurti-sets.webp"
import frontImage from "../assets/about-front.webp"
import backImage from "../assets/about-background.webp"

// ── Core Values Data ──────────────────────────────────────────────────────────
const coreValues = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AB721E" strokeWidth="1.5">
        <path d="M12 2a9 9 0 0 1 9 9c0 4.97-9 13-9 13S3 15.97 3 11a9 9 0 0 1 9-9z" />
        <circle cx="12" cy="11" r="3" />
      </svg>
    ),
    title: "Quality You Can Feel",
    description: "Carefully chosen fabrics and close attention to finishing — because a garment should feel as good as it looks.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AB721E" strokeWidth="1.5">
        <path d="M12 19l7-7 3 3-7 7-3-3z" />
        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="M2 2l7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </svg>
    ),
    title: "Modern Designs",
    description: "Styles that work for college, office, travel, casual outings, and festive days — ethnic wear that fits your whole life.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#AB721E" strokeWidth="1.5">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
    title: "Affordable Pricing",
    description: "Built on decades of sourcing and retail experience, not inflated markups. Great value is part of the design.",
  },
];

// ── Grid image placeholders ───────────────────────────────────────────────────
const gridImages = [
  { title: "Short Kurtis", path: "/categories/short-kurtis", image: shortkurtibanner },
  { title: "Long Kurtis", path: "/categories/long-kurtis", image: longkurtibanner },
  { title: "Dresses", path: "/categories/dresses", image: dressesbanner },
  { title: "Kurti Sets", path: "/categories/kurti-sets", image: kurtisetbanner },
];

// ── About Page ────────────────────────────────────────────────────────────────
const AboutPage = () => {
  const navigate = useNavigate();
  const story = useInView(0.1);
  const grid = useInView(0.1);

  const [valuesInView, setValuesInView] = useState(false);
  const valuesRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !valuesInView) {
          setValuesInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (valuesRef.current) observer.observe(valuesRef.current);
    return () => observer.disconnect();
  }, [valuesInView]);

  return (
    <div style={{ backgroundColor: "#F9F3EB", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(480px, 70vh, 700px)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(160deg, #1a0f05 0%, #2B2112 30%, #4A3728 60%, #8B6914 85%, #C47B1E 100%)",
          }}
        />

        {/* Woven texture overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg, transparent, transparent 3px,
              rgba(255,255,255,0.06) 3px, rgba(255,255,255,0.06) 4px
            ), repeating-linear-gradient(
              90deg, transparent, transparent 6px,
              rgba(255,255,255,0.04) 6px, rgba(255,255,255,0.04) 7px
            )`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 60% 40%, rgba(196,123,30,0.25) 0%, transparent 65%)" }}
        />

        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: "160px", background: "linear-gradient(to bottom, transparent, #F9F3EB)", zIndex: 2 }}
        />

        {/* Hero Text */}
        <div
          className="absolute inset-0 flex items-center justify-center text-center px-6"
          style={{ zIndex: 3 }}
        >
          <div>
            <p
              className="mb-4 text-[11px] font-bold uppercase tracking-[0.3em]"
              style={{ fontFamily: "'Jost', sans-serif", color: "rgba(245,230,208,0.6)" }}
            >
              Est. 1971 · Haridwar
            </p>
            <h1
              className="text-[32px] sm:text-[42px] lg:text-[52px] font-normal italic leading-tight text-white"
              style={{ fontFamily: "'EB Garamond', serif", textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}
            >
              50 Years of Fabric.
              <br />One Modern Brand.
            </h1>
            <div
              className="mx-auto mt-5 h-[1px] w-12"
              style={{ backgroundColor: "#AB721E" }}
            />
          </div>
        </div>
      </div>

      {/* ── THE NAARISA STORY ── */}
      <section
        className="w-full overflow-hidden px-4 py-16 sm:px-6 md:px-10 xl:px-12 sm:py-20"
        style={{ backgroundColor: "#F9F3EB" }}
      >
        <div
          ref={story.ref}
          className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center"
        >
          {/* LEFT — Text */}
          <div
            className="transition-all duration-1000"
            style={{
              opacity: story.inView ? 1 : 0,
              transform: story.inView ? "translateX(0)" : "translateX(-32px)",
            }}
          >
            <p
              className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em]"
              style={{ fontFamily: "'Jost', sans-serif", color: "#AB721E" }}
            >
              Our Story
            </p>

            <h2
              className="mb-5 text-[30px] sm:text-[36px] font-normal leading-tight"
              style={{ fontFamily: "'EB Garamond', serif", color: "#1f1b15" }}
            >
              A Family Legacy, Now Online
            </h2>

            <p
              className="mb-5 text-[15px] font-light leading-[1.9]"
              style={{ fontFamily: "'Jost', sans-serif", color: "#4A3728" }}
            >
              Naarisa is built on a family legacy in Indian ethnic wear that began in Haridwar in 1971.
              What started as a local retail store serving generations of women has now evolved into a
              modern online brand for today's customer.
            </p>

            <p
              className="mb-6 text-[15px] font-light leading-[1.9]"
              style={{ fontFamily: "'Jost', sans-serif", color: "#4A3728" }}
            >
              For more than 50 years, our family has worked directly with fabrics, fits, craftsmanship,
              and customer feedback. That experience shapes every Naarisa collection — ethnic wear that
              feels current, comfortable, and worth repeating, not just pieces that look good in a photo.
            </p>

            {/* Pull quote */}
            <div
              className="mb-8 pl-5"
              style={{ borderLeft: "2px solid #AB721E" }}
            >
              <p
                className="text-[16px] leading-[1.8] italic"
                style={{ fontFamily: "'EB Garamond', serif", color: "#4A3728" }}
              >
                "We grew up in a store where repeat customers mattered more than one-time sales."
              </p>
            </div>

            <button
              className="inline-flex items-center gap-3 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.18em] transition-all duration-300"
              style={{
                fontFamily: "'Jost', sans-serif",
                backgroundColor: "#AB721E",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => navigate("/all-products")}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B6914")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#AB721E")}
            >
              Shop the Collection
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </div>

          {/* RIGHT — Overlapping image blocks */}
          <div
            className="relative transition-all duration-1000"
            style={{
              opacity: story.inView ? 1 : 0,
              transform: story.inView ? "translateX(0)" : "translateX(32px)",
              transitionDelay: "150ms",
              height: "460px",
            }}
          >
            {/* Main large block with front image */}
            <div
              className="absolute right-0 top-0 overflow-hidden"
              style={{
                width: "72%",
                height: "62%",
              }}
            >
              <img
                src={backImage}
                alt="About Us Front"
                className="w-full h-full sm:object-cover"
              />

              {/* Overlay for "Since 1971" text */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, rgba(245,230,208,0.2) 0%, rgba(196,123,30,0.1) 100%)"
                }}
              />

              <div className="absolute bottom-3 right-3">
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(245,230,208,0.8)" }}>
                  Since 1971
                </p>
              </div>
            </div>

            {/* Overlapping smaller block with back image */}
            <div
              className="absolute bottom-0 left-0 overflow-hidden"
              style={{
                width: "58%",
                height: "55%",
                border: "4px solid #F9F3EB",
                zIndex: 2,
              }}
            >
              <img
                src={frontImage}
                alt="About Us Background"
                className="w-full h-full sm:object-contain"
              />

              {/* Overlay for darker tone */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(160deg, rgba(43,33,18,0.3) 0%, rgba(74,55,40,0.2) 100%)"
                }}
              />

              <div className="absolute bottom-3 left-3">
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "rgba(245,230,208,0.9)" }}>
                  Haridwar
                </p>
              </div>
            </div>

            {/* Decorative corner */}
            <div
              className="absolute right-0 top-0 h-10 w-10"
              style={{
                borderRight: "2px solid #C47B1E",
                borderTop: "2px solid #C47B1E",
                transform: "translate(6px, -6px)",
                zIndex: 3,
              }}
            />
          </div>
        </div>
      </section>

      {/* ── FOR WOMEN WHO WANT BOTH ── */}
      <section
        className="w-full px-4 py-16 sm:px-6 md:px-10 xl:px-12 sm:py-20"
        style={{ backgroundColor: "#2B2112" }}
      >
        <div className="mx-auto max-w-[760px] text-center">
          <p
            className="mb-4 text-[11px] font-bold uppercase tracking-[0.24em]"
            style={{ fontFamily: "'Jost', sans-serif", color: "#AB721E" }}
          >
            Our Promise
          </p>
          <h2
            className="mb-6 text-[28px] sm:text-[36px] font-normal italic leading-snug"
            style={{ fontFamily: "'EB Garamond', serif", color: "#F9F3EB" }}
          >
            For Women Who Want Both Style and Value
          </h2>
          <p
            className="mb-5 text-[14px] font-light leading-[1.9]"
            style={{ fontFamily: "'Jost', sans-serif", color: "#C4A882" }}
          >
            We know the frustration of ethnic wear that is trendy but overpriced, or affordable but
            poorly made. Naarisa aims for the middle ground — latest designs, dependable quality, and
            prices that make sense.
          </p>
          <p
            className="text-[14px] font-light leading-[1.9]"
            style={{ fontFamily: "'Jost', sans-serif", color: "#C4A882" }}
          >
            Our goal is simple: when you buy a kurta, kurta set, dress, or ethnic outfit from Naarisa,
            it should become something you reach for often — not something that sits in your wardrobe
            after one wear.
          </p>
          <div className="mx-auto mt-8 h-[1px] w-10" style={{ backgroundColor: "#AB721E" }} />
        </div>
      </section>

      {/* ── CORE VALUES ── */}
      <section
        className="w-full overflow-hidden px-4 py-16 sm:px-6 sm:py-20 md:px-10 xl:px-12"
        style={{ backgroundColor: "#F5E6D0" }}
      >
        {/* Header */}
        <div
          ref={valuesRef}
          className="mb-12 text-center"
          style={{
            opacity: valuesInView ? 1 : 0,
            transform: valuesInView ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          <h2
            className="mb-2 text-[28px] sm:text-[34px] font-normal italic"
            style={{ fontFamily: "'EB Garamond', serif", color: "#1f1b15" }}
          >
            What We Stand For
          </h2>
          <p
            className="text-[13px] font-light"
            style={{ fontFamily: "'Jost', sans-serif", color: "#8C7B6B" }}
          >
            The values behind every piece we make
          </p>
          <div
            style={{
              backgroundColor: "#AB721E",
              height: "1px",
              width: valuesInView ? "40px" : "0px",
              margin: "16px auto 0",
              transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1) 300ms",
            }}
          />
        </div>

        {/* Cards Grid */}
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-5 sm:grid-cols-3">
          {coreValues.map((val, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "#fff",
                border: "1px solid #E8DDD0",
                padding: "32px 28px",
                opacity: valuesInView ? 1 : 0,
                transform: valuesInView
                  ? "translateY(0) scale(1)"
                  : "translateY(30px) scale(0.95)",
                transition: `opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 100}ms,
    transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 100}ms`,
                willChange: "opacity, transform",
              }}
            >
              <div
                className="mb-5 flex h-11 w-11 items-center justify-center"
                style={{
                  backgroundColor: "#F5E6D0",
                  border: "1px solid #E8DDD0",
                  transition: "background-color 0.3s ease",
                }}
              >
                {val.icon}
              </div>
              <h3
                className="mb-3 text-[20px] font-normal"
                style={{ fontFamily: "'EB Garamond', serif", color: "#1f1b15" }}
              >
                {val.title}
              </h3>
              <p
                className="text-[13px] font-light leading-[1.8]"
                style={{ fontFamily: "'Jost', sans-serif", color: "#4A3728" }}
              >
                {val.description}
              </p>
            </div>
          ))}
        </div >
      </section >

      {/* ── LIFESTYLE GRID ── */}
      < section
        ref={grid.ref}
        className="w-full"
        style={{ backgroundColor: "#2B2112" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {gridImages.map((item, index) => (
            <div
              key={index}
              onClick={() => navigate(item.path)}
              className="relative overflow-hidden cursor-pointer group transition-all duration-700 p-2"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                decoding="async"
                className="w-full h-auto block transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

              {/* Title Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F5E6D0]"
                  style={{ fontFamily: "'Jost', sans-serif" }}
                >
                  {item.title}
                </p>
              </div>

              {/* Brand */}
              <div className="absolute bottom-3 left-3">
                <p className="text-[9px] font-bold uppercase tracking-widest text-[#F5E6D0]/60">
                  Naarisa
                </p>
              </div>
            </div>
          ))}
        </div>
      </section >
      <div style={{ height: "16px", backgroundColor: "#F5E6D0" }} />
    </div >
  );
};

export default AboutPage;