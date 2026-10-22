import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useInView from "../../utils/useInView.js";
import { BASE, PRODUCT } from "../../Constants/apiRoutes.js";

const MostLoved = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const header = useInView();
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE.ROUTE}${PRODUCT.BEST_SELLERS}`);
        if (res.data.success) {
          console.log("Best Sellers : ", res.data)
          setProducts(res.data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch best sellers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <section
      className="w-full overflow-hidden py-14 sm:py-16 md:py-20"
      style={{ backgroundColor: "#F5E6D0" }}
    >
      {/* Header */}
      <div
        ref={header.ref}
        className="mb-10 px-4 text-center transition-all duration-700 sm:px-6 md:px-10 xl:px-12"
        style={{
          opacity: header.inView ? 1 : 0,
          transform: header.inView ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <p
          className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em]"
          style={{ fontFamily: "'Jost', sans-serif", color: "#C47B1E" }}
        >
          Customer Favourites
        </p>
        <h2
          className="text-[28px] font-normal italic sm:text-[34px] md:text-[38px]"
          style={{ fontFamily: "'EB Garamond', serif", color: "#1f1b15" }}
        >
          Most Loved
        </h2>
        <div
          className="mx-auto mt-3 h-[1px] w-10 transition-all duration-1000"
          style={{
            backgroundColor: "#C47B1E",
            width: header.inView ? "40px" : "0px",
          }}
        />
      </div>

      {/* 4-col grid desktop, 2-col mobile */}
      <div className="mx-auto grid w-full max-w-[1100px] grid-cols-2 gap-x-4 gap-y-8 px-4 sm:px-6 md:grid-cols-4 md:px-10 xl:px-12">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))
          : products.map((product, index) => (
            <GridProductCard
              key={product._id}
              product={product}
              index={index}
              onClick={() => navigate(`/product/${product.slug}`)}
            />
          ))}
      </div>

      {/* View All CTA */}
      {!loading && products.length > 0 && (
        <div className="mt-12 text-center">
          <button
            className="inline-flex items-center gap-2 px-8 py-3 text-[12px] font-bold uppercase tracking-[0.18em] transition-all duration-300"
            style={{
              fontFamily: "'Jost', sans-serif",
              border: "1px solid #AB721E",
              color: "#AB721E",
            }}
            onClick={() => navigate("/best-sellers")}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#AB721E";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#AB721E";
            }}
          >
            View All Products
            <span>→</span>
          </button>
        </div>
      )}
    </section>
  );
};

const GridProductCard = ({ product, index, onClick }) => {
  const { ref, inView } = useInView(0.1);

  const basePrice = product.productId?.basePrice || 0;
  const sellingPrice = product.discountPrice || basePrice;

  const isOnSale =
    product.discountPrice &&
    product.discountPrice < basePrice;

  const image = product.images?.[0]?.url;

  return (
    <div
      ref={ref}
      className="cursor-pointer"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(24px)",
        transition: "all 0.6s ease",
        transitionDelay: `${(index % 4) * 100}ms`,
      }}
      onClick={onClick}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "3/4", backgroundColor: "#F0E8DC" }}
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
          className="mb-1 text-[13px] font-normal leading-snug sm:text-[14px]"
          style={{
            fontFamily: "'EB Garamond', serif",
            color: "#1f1b15",
          }}
        >
          {product.productId?.name}
        </p>

        <div className="flex items-center gap-2">
          <span
            className="text-[13px] font-semibold sm:text-[14px]"
            style={{
              fontFamily: "'Jost', sans-serif",
              color: isOnSale ? "#C47B1E" : "#1f1b15",
            }}
          >
            ₹{sellingPrice.toLocaleString("en-IN")}
          </span>

          {isOnSale && (
            <span
              className="text-[11px] line-through sm:text-[12px]"
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
          <div className="mt-1.5 flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-full border"
              style={{
                backgroundColor: product.color.hex,
                borderColor: "#E8DDD0",
              }}
            />
            <span
              className="text-[10px] capitalize sm:text-[11px]"
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
  <div>
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

export default MostLoved;