import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useInView from "../../utils/useInView.js";
import { BASE, PRODUCT } from "../../Constants/apiRoutes.js";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const header = useInView();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE.ROUTE}${PRODUCT.NEW_ARRIVALS}`);
        if (res.data.success) {
          console.log("New Arrivals : ", res.data)
          setProducts(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch new arrivals:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        el.scrollLeft += e.deltaX;
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
  };

  return (
    <section
      className="w-full overflow-hidden py-8 md:py-10"
      style={{ backgroundColor: "#F9F3EB" }}
    >
      {/* Header */}
      <div
        ref={header.ref}
        className="mb-8 px-4 transition-all duration-700 sm:px-6 md:px-10 xl:px-12"
        style={{
          opacity: header.inView ? 1 : 0,
          transform: header.inView ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div className="mx-auto flex max-w-[1100px] items-end justify-between">
          <div>
            <p
              className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]"
              style={{ fontFamily: "'Jost', sans-serif", color: "#C47B1E" }}
            >
              Just Arrived
            </p>
            <h2
              className="text-[28px] font-normal italic sm:text-[34px] md:text-[38px]"
              style={{ fontFamily: "'EB Garamond', serif", color: "#1f1b15" }}
            >
              New Arrivals
            </h2>
          </div>

          {/* Arrow buttons */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={scrollLeft}
              className="flex h-9 w-9 items-center justify-center border transition-all duration-300"
              style={{
                borderColor: "#C47B1E",
                color: "#C47B1E",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C47B1E";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#C47B1E";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={scrollRight}
              className="flex h-9 w-9 items-center justify-center border transition-all duration-300"
              style={{
                borderColor: "#C47B1E",
                color: "#C47B1E",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#C47B1E";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#C47B1E";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Row */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto overflow-y-hidden px-4 pb-2 sm:px-6 md:px-10 xl:px-12"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
          : products.map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              index={index}
              onClick={() => navigate(`/product/${product.slug}`)}
            />
          ))}
      </div>
    </section>
  );
};

const ProductCard = ({ product, index, onClick }) => {
  const { ref, inView } = useInView(0.1);
  const [hasAppeared, setHasAppeared] = useState(false);

  useEffect(() => {
    if (inView && !hasAppeared) setHasAppeared(true);
  }, [inView, hasAppeared]);

  const basePrice = product.productId?.basePrice || 0;
  const sellingPrice = product.discountPrice || basePrice;

  const isOnSale =
    product.discountPrice &&
    product.discountPrice < basePrice;

  const image = product.images?.[0]?.url;

  return (
    <div
      ref={ref}
      className="flex-shrink-0 cursor-pointer"
      style={{
        width: "260px",
        opacity: hasAppeared ? 1 : 0,
        transform: hasAppeared ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
        transitionDelay: hasAppeared ? "0ms" : `${index * 60}ms`,
      }}
      onClick={onClick}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: "3/4",
          backgroundColor: "#F0E8DC",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={product.productId?.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, #F5E6D0, #C4A882)",
            }}
          >
            <span
              className="text-[11px] font-bold uppercase tracking-widest"
              style={{ color: "#8C7B6B" }}
            >
              Naarisa
            </span>
          </div>
        )}

        {isOnSale && (
          <div
            className="absolute left-0 top-3 px-2 py-1"
            style={{
              backgroundColor: "#C4727A",
              fontFamily: "'Jost', sans-serif",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: "#fff",
            }}
          >
            SALE
          </div>
        )}
      </div>

      {/* Info */}
      <div className="pt-3">
        <p
          className="mb-1 text-[13px] font-normal leading-snug"
          style={{
            fontFamily: "'EB Garamond', serif",
            color: "#1f1b15",
          }}
        >
          {product.productId?.name}
        </p>

        <div className="flex items-center gap-2">
          <span
            className="text-[14px] font-semibold"
            style={{
              fontFamily: "'Jost', sans-serif",
              color: isOnSale ? "#C47B1E" : "#1f1b15",
            }}
          >
            ₹{sellingPrice.toLocaleString("en-IN")}
          </span>

          {isOnSale && (
            <span
              className="text-[12px] line-through"
              style={{
                fontFamily: "'Jost', sans-serif",
                color: "#8C7B6B",
              }}
            >
              ₹{basePrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {product.color && (
          <div className="mt-2 flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-full border"
              style={{
                backgroundColor: product.color.hex,
                borderColor: "#E8DDD0",
              }}
            />
            <span
              className="text-[11px] capitalize"
              style={{
                fontFamily: "'Jost', sans-serif",
                color: "#8C7B6B",
              }}
            >
              {product.color.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="flex-shrink-0" style={{ width: "260px" }}>
    <div
      className="animate-pulse"
      style={{
        aspectRatio: "3/4",
        backgroundColor: "#E8DDD0",
      }}
    />
    <div className="pt-3 space-y-2">
      <div className="h-3 w-3/4 animate-pulse rounded" style={{ backgroundColor: "#E8DDD0" }} />
      <div className="h-3 w-1/3 animate-pulse rounded" style={{ backgroundColor: "#E8DDD0" }} />
    </div>
  </div>
);

export default NewArrivals;