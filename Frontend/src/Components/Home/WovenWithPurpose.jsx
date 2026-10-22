import { Link } from "react-router-dom";
import useInView from "../../utils/useInView.js";
import wovenwithpurpose from "../../assets/woven-with-purpose.webp";

const brandValues = [
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a9 9 0 0 1 9 9c0 4.97-9 13-9 13S3 15.97 3 11a9 9 0 0 1 9-9z" />
        <circle cx="12" cy="11" r="3" />
      </svg>
    ),
    label: "Pure Organics",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    label: "Ethically Made",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    label: "Artisan Crafted",
  },
  {
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
      </svg>
    ),
    label: "Natural Dyes",
  },
];

const WovenWithPurpose = () => {
  const image = useInView(0.1);
  const content = useInView(0.1);
  const strip = useInView(0.1);

  const isDesktop = window.innerWidth >= 1024;

  return (
    <>
      {/* MAIN SECTION */}
      <section
        className="w-full overflow-hidden px-4 py-10 sm:px-6 sm:py-14 md:px-8 md:py-16 xl:px-10"
        style={{ backgroundColor: "#F5E6D0" }}
      >
        <div className="mx-auto grid w-full max-w-[1000px] grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">

          {/* LEFT */}
          <div
            ref={image.ref}
            className="relative transition-all duration-1000"
            style={{
              opacity: image.inView ? 1 : 0,
              transform: image.inView
                ? "translate(0, 0)"
                : isDesktop
                  ? "translateX(-48px)"
                  : "translateY(20px)",
            }}
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4/3" }}
            >
              <img
                src={wovenwithpurpose}
                alt="Woven With Purpose"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Optional subtle overlay for text readability */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.28), transparent 45%)",
                }}
              />

              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                <p
                  className="text-[9px] font-bold uppercase tracking-[0.2em] sm:text-[10px]"
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    color: "#fff",
                  }}
                >
                  Artisan Craft
                </p>
              </div>
            </div>

            {/* Decorative corners — desktop only */}
            <div
              className="absolute -bottom-3 -left-3 hidden h-10 w-10 transition-all duration-700 lg:block"
              style={{
                borderBottom: "2px solid #C47B1E",
                borderLeft: "2px solid #C47B1E",
                opacity: image.inView ? 1 : 0,
                transitionDelay: "400ms",
              }}
            />
            <div
              className="absolute -right-3 -top-3 hidden h-10 w-10 transition-all duration-700 lg:block"
              style={{
                borderRight: "2px solid #C47B1E",
                borderTop: "2px solid #C47B1E",
                opacity: image.inView ? 1 : 0,
                transitionDelay: "400ms",
              }}
            />
          </div>

          {/* RIGHT */}
          <div
            ref={content.ref}
            className="flex flex-col gap-4 transition-all duration-1000 sm:gap-5"
            style={{
              opacity: content.inView ? 1 : 0,
              transform: content.inView
                ? "translate(0, 0)"
                : isDesktop
                  ? "translateX(48px)"
                  : "translateY(20px)",
              transitionDelay: "150ms",
            }}
          >
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em] sm:text-[11px]"
              style={{ fontFamily: "'Jost', sans-serif", color: "#C47B1E" }}
            >
              Our Ethos
            </p>

            <h2
              className="text-[28px] font-normal italic leading-tight sm:text-[34px] lg:text-[40px]"
              style={{ fontFamily: "'EB Garamond', serif", color: "#1f1b15" }}
            >
              Woven With Purpose
            </h2>

            <div
              className="h-[1px] transition-all duration-1000"
              style={{
                backgroundColor: "#C47B1E",
                width: content.inView ? "40px" : "0px",
                transitionDelay: "400ms",
              }}
            />

            <p
              className="text-[13px] font-light leading-[1.8] sm:text-[14px] lg:text-[15px]"
              style={{ fontFamily: "'Jost', sans-serif", color: "#4A3728" }}
            >
              Naarisa is a modern ethnic wear brand built on over 50 years of family experience in women's fashion. Our journey began in Haridwar in 1971, where generations of our family served customers through a trusted retail store. Today, we bring that same understanding of quality, fit, and value online.
            </p>

            <Link
              to="/about"
              className="group mt-1 inline-flex w-fit items-center gap-2 px-5 py-2.5 text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 sm:px-6 sm:py-3 sm:text-[11px]"
              style={{
                fontFamily: "'Jost', sans-serif",
                border: "1px solid #AB721E",
                color: "#AB721E",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#AB721E";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#AB721E";
              }}
            >
              Our Story
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND VALUES STRIP */}
      <section
        ref={strip.ref}
        className="w-full overflow-hidden px-4 py-8 sm:px-6 md:px-8 xl:px-10"
        style={{
          backgroundColor: "#F9F3EB",
          borderTop: "1px solid #E8DDD0",
        }}
      >
        <div className="mx-auto grid w-full max-w-[1000px] grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6">
          {brandValues.map((value, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 text-center transition-all duration-700"
              style={{
                opacity: strip.inView ? 1 : 0,
                transform: strip.inView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${index * 120}ms`,
              }}
            >
              <div style={{ color: "#C47B1E" }}>
                {value.icon}
              </div>
              <p
                className="text-[9px] font-bold uppercase tracking-[0.16em] sm:text-[10px]"
                style={{ fontFamily: "'Jost', sans-serif", color: "#8C7B6B" }}
              >
                {value.label}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default WovenWithPurpose;