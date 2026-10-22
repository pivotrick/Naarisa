import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  badge = null,
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const image =
    product.image ??
    product.images?.[0]?.url;

  const productName = product.name || product.productId?.name;

  const name = `${productName} - ${product.color?.name
    ? product.color.name.charAt(0).toUpperCase() +
    product.color.name.slice(1)
    : ""
    }`;

  const originalPrice =
    product.price ??
    product.productId?.basePrice;

  const discountedPrice =
    product.discountPrice ?? null;

  const hasDiscount = discountedPrice && originalPrice && discountedPrice < originalPrice;

  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0;

  return (

    <div
      onClick={() => navigate(`/product/${product.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: "pointer",
        backgroundColor: "#fff",
      }}
    >
      <div
        style={{
          position: "relative",
          aspectRatio: "3/4",
          overflow: "hidden",
          backgroundColor: "#F5E6D0",
        }}
      >
        {badge && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 1,
              backgroundColor: "#1f1b15",
              color: "#F9F3EB",
              fontFamily: "'Jost', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              padding: "3px 8px",
            }}
          >
            {badge}
          </div>
        )}

        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform .5s ease",
              transform: hovered ? "scale(1.04)" : "scale(1)",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Jost', sans-serif",
              color: "#8C7B6B",
            }}
          >
            NAARISA
          </div>
        )}
      </div>

      <div style={{ padding: "12px 4px 16px" }}>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "15px",
            color: "#1f1b15",
            lineHeight: 1.35,
            marginBottom: "6px",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {name}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            flexWrap: "wrap",
          }}
        >
          {discountedPrice ? (
            <>
              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#1f1b15",
                }}
              >
                ₹{discountedPrice.toLocaleString("en-IN")}
              </span>

              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "13px",
                  color: "#8C7B6B",
                  textDecoration: "line-through",
                }}
              >
                ₹{originalPrice?.toLocaleString("en-IN")}
              </span>

              <span
                style={{
                  fontFamily: "'Jost', sans-serif",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#AB721E",
                }}
              >
                {discountPercent}% OFF
              </span>
            </>
          ) : (
            <span
              style={{
                fontFamily: "'Jost', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                color: "#1f1b15",
              }}
            >
              ₹{originalPrice?.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {product.color?.hex && (
          <div
            style={{
              display: "flex",
              gap: "5px",
              marginTop: "8px",
            }}
          >
            <div
              title={product.color.name}
              style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                backgroundColor: product.color.hex,
                border: "1px solid #E8DDD0",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;