import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE, BANNER } from "../../Constants/apiRoutes.js";
import { ikImage } from "../../utils/imageOptimization.js";

const HeroSlider = () => {
  const [banners, setBanners]   = useState([]);
  const [current, setCurrent]   = useState(0);
  const [loading, setLoading]   = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const intervalRef             = useRef(null);
  const navigate                = useNavigate();

  // ── Responsive — switch desktop/mobile image ─────────────────────────────
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Fetch active banners (sorted by order from backend) ──────────────────
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${BASE.ROUTE}${BANNER.GET_ACTIVE}`);
        if (res.data.success) {
          console.log(res.data)
          setBanners(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // ── Auto-play ─────────────────────────────────────────────────────────────
  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
  }, [banners.length]);

  const stopAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      startAutoPlay();
      return () => stopAutoPlay();
    }
  }, [banners.length, startAutoPlay, stopAutoPlay]);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goTo = (index) => {
    stopAutoPlay();
    setCurrent(index);
    startAutoPlay();
  };

  const goPrev = () => goTo((current - 1 + banners.length) % banners.length);
  const goNext = () => goTo((current + 1) % banners.length);

  const handleBannerClick = (link) => {
    if (!link) return;
    const cleanLink = link.replace(/^"|"$/g, "").trim();
    if (cleanLink.startsWith("http")) {
      window.open(cleanLink, "_blank");
    } else {
      navigate(cleanLink);
    }
  };

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        className="w-full animate-pulse"
        style={{
          aspectRatio: isMobile ? "9/16" : "1672/941",
          background: "linear-gradient(135deg, #2B2112 0%, #4A3728 50%, #8B6914 100%)",
        }}
      />
    );
  }

  if (!banners.length) return null;

  return (
    <div className="relative w-full overflow-hidden">

      {/* ── Slides ── */}
      <div
        className="relative w-full"
        style={{ aspectRatio: isMobile ? "9/16" : "1672/941" }}
      >
        {banners.map((banner, index) => {

          // ✅ Desktop vs Mobile image switch
          const imgUrl = isMobile ? banner.mobileImage : banner.desktopImage;

          return (
            <div
              key={banner._doc._id}
              className="absolute inset-0 transition-opacity duration-1000"
              style={{
                opacity: index === current ? 1 : 0,
                zIndex: index === current ? 1 : 0,
                cursor: banner.link ? "pointer" : "default",
              }}
              onClick={() => handleBannerClick(banner._doc.link)}
            >
              {/* Banner Image */}
              <img
                src={ikImage(imgUrl, isMobile ? 900 : 1600)}
                alt="Naarisa Banner"
                // first slide is the most important image on the page; the rest can wait
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
                className="w-full h-full"
                style={{
                  objectFit: "cover",
                  objectPosition: "top center",
                  display: "block",
                }}
              />
            </div>
          );
        })}

        {/* ── Prev arrow ── */}
        {banners.length > 1 && (
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-300"
            style={{
              width: isMobile ? "36px" : "44px",
              height: isMobile ? "36px" : "44px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(43,33,18,0.3)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(171,114,30,0.8)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(43,33,18,0.3)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* ── Next arrow ── */}
        {banners.length > 1 && (
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center transition-all duration-300"
            style={{
              width: isMobile ? "36px" : "44px",
              height: isMobile ? "36px" : "44px",
              border: "1px solid rgba(255,255,255,0.4)",
              background: "rgba(43,33,18,0.3)",
              backdropFilter: "blur(4px)",
              color: "#fff",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(171,114,30,0.8)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(43,33,18,0.3)"}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* ── Dot indicators ── */}
        {banners.length > 1 && (
          <div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
            style={{ zIndex: 10 }}
          >
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => goTo(index)}
                style={{
                  width: index === current ? "28px" : "8px",
                  height: "3px",
                  background: index === current
                    ? "#AB721E"
                    : "rgba(255,255,255,0.6)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.4s ease",
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* ── Bottom blur fade into next section ── */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{
            height: "100px",
            background: "linear-gradient(to bottom, transparent, #F9F3EB)",
            zIndex: 5,
          }}
        />
      </div>
    </div>
  );
};

export default HeroSlider;