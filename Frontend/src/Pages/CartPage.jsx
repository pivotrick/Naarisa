import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartStore from "../Store/useCartStore.js";
import useCheckoutStore from "../Store/useCheckoutStore.js";
import { ikImage } from "../utils/imageOptimization.js";

// ── Trash Icon ────────────────────────────────────────────────────────────────
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);

// ── Shield Icon ───────────────────────────────────────────────────────────────
const ShieldIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

// ── Truck Icon ────────────────────────────────────────────────────────────────
const TruckIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// ── Cart Item ─────────────────────────────────────────────────────────────────
const CartItem = ({ item, onRemove, onQtyChange, navigate }) => (
  <div style={{ border: "1px solid #E8DDD0", backgroundColor: "#fff", padding: "16px", marginBottom: "12px" }}>
    <div onClick={() => navigate(`/product/${item.slug}`)} className="flex gap-4">
      <div style={{ width: "90px", aspectRatio: "3/4", flexShrink: 0, overflow: "hidden", backgroundColor: "#F5E6D0", cursor: "pointer" }}>
        {item.image ? (
          <img src={ikImage(item.image, 240)} alt={item.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", color: "#8C7B6B", letterSpacing: "0.1em" }}>NAARISA</span>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div
          style={{ cursor: "pointer" }}
        >
          <h3
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "17px",
              fontWeight: 400,
              color: "#1f1b15",
              lineHeight: 1.3,
              marginBottom: "4px",
            }}
          >
            {item.name}
          </h3>

          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "12px",
              color: "#8C7B6B",
              letterSpacing: "0.04em",
            }}
          >
            Color: {item.color} | Size: {item.size}
          </p>
        </div>

        <div className="flex items-end justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center" style={{ border: "1px solid #E8DDD0", backgroundColor: "#F9F3EB" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onQtyChange(item.id, item.qty - 1) }}
              style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Jost', sans-serif", fontSize: "16px", color: "#1f1b15", background: "none", border: "none", cursor: "pointer" }}
            >−</button>
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 600, color: "#1f1b15", width: "28px", textAlign: "center" }}>
              {item.qty}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onQtyChange(item.id, item.qty + 1) }}
              style={{ width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Jost', sans-serif", fontSize: "16px", color: "#1f1b15", background: "none", border: "none", cursor: "pointer" }}
            >+</button>
          </div>

          <div className="flex items-center gap-4">
            <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "16px", fontWeight: 600, color: "#1f1b15" }}>
              ₹{(item.price * item.qty).toLocaleString("en-IN")}
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(item.id) }}
              style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 600, letterSpacing: "0.1em", color: "#8C7B6B", display: "flex", alignItems: "center", gap: "5px", background: "none", border: "none", cursor: "pointer", padding: 0, transition: "color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C4727A")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8C7B6B")}
            >
              <TrashIcon /> REMOVE
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Empty Cart ────────────────────────────────────────────────────────────────
const EmptyCart = ({ navigate }) => (
  <div style={{ backgroundColor: "#F9F3EB", minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "20px", padding: "60px 20px" }}>
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C4A882" strokeWidth="1">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 001.98 1.61h9.72a2 2 0 001.98-1.61L23 6H6" />
    </svg>
    <div style={{ textAlign: "center" }}>
      <h2 style={{ fontFamily: "'EB Garamond', serif", fontSize: "26px", fontWeight: 400, color: "#1f1b15", marginBottom: "8px" }}>
        Your cart is empty
      </h2>
      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#8C7B6B", fontWeight: 300 }}>
        Discover our handcrafted collections
      </p>
    </div>
    <button
      onClick={() => navigate("/all-products")}
      style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", padding: "14px 32px", backgroundColor: "#2B2112", color: "#F5E6D0", border: "none", cursor: "pointer", marginTop: "8px" }}
    >
      EXPLORE COLLECTION
    </button>
  </div>
);

// ── Main Cart Page ────────────────────────────────────────────────────────────
const CartPage = () => {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQty = useCartStore((state) => state.updateQty);
  const setOrderSummary = useCheckoutStore((state) => state.setOrderSummary);

  const handleRemove = (id) => removeItem(id);
  const handleQtyChange = (id, newQty) => updateQty(id, newQty);

  // ── Calculations (no tax) ──
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = subtotal;

  const handleCheckout = () => {
    // Clear any previous coupon state when going to checkout
    setOrderSummary({ subtotal, discountAmount: 0, appliedCoupon: null, total });
    navigate("/checkout");
  };

  if (items.length === 0) return <EmptyCart navigate={navigate} />;

  return (
    <div style={{ backgroundColor: "#F9F3EB", minHeight: "100vh" }} className="pb-28 lg:pb-0">

      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1200px] px-4 pt-5 sm:px-6 md:px-10 xl:px-12">
        <p className="text-[11px] uppercase tracking-[0.14em]" style={{ fontFamily: "'Jost', sans-serif", color: "#8C7B6B" }}>
          <span className="cursor-pointer hover:text-[#C47B1E] transition-colors" onClick={() => navigate("/")}>Home</span>
          <span className="mx-2">/</span>
          <span style={{ color: "#1f1b15" }}>Your Cart</span>
        </p>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-[1200px] px-4 pt-4 pb-6 sm:px-6 md:px-10 xl:px-12">
        <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 400, color: "#1f1b15" }}>
          Your Cart{" "}
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", fontWeight: 400, color: "#8C7B6B", letterSpacing: "0.04em" }}>
            ({items.length} {items.length === 1 ? "item" : "items"})
          </span>
        </h1>
      </div>

      {/* Main Grid */}
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 md:px-10 xl:px-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_380px] lg:gap-10 lg:items-start">

          {/* Left — Cart Items */}
          <div>
            {items.map((item) => (
              <CartItem key={item.id} item={item} onRemove={handleRemove} onQtyChange={handleQtyChange} navigate={navigate} />
            ))}
            <button
              onClick={() => navigate(-1)}
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "#fff",
                background: "#AB721E",
                cursor: "pointer",
                padding: "12px 24px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "16px",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#8B6914";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#AB721E";
                e.currentTarget.style.color = "#fff";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              CONTINUE SHOPPING
            </button>
          </div>

          {/* Right — Summary Panel */}
          <div className="lg:sticky lg:top-24">

            {/* Order Summary */}
            <div style={{ backgroundColor: "#fff", border: "1px solid #E8DDD0", padding: "20px", marginBottom: "12px" }}>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.16em", color: "#1f1b15", marginBottom: "16px" }}>
                ORDER SUMMARY
              </h2>

              {[
                { label: `Subtotal (${items.length} ${items.length === 1 ? "item" : "items"})`, value: `₹${subtotal.toLocaleString("en-IN")}`, accent: false },
                { label: "Shipping", value: "FREE", accent: true },
              ].map(({ label, value, accent }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#4A3728", fontWeight: 400 }}>{label}</span>
                  <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 600, color: accent ? "#2D6B5A" : "#1f1b15" }}>{value}</span>
                </div>
              ))}

              <div style={{ borderTop: "1px solid #E8DDD0", margin: "16px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", color: "#1f1b15" }}>Total</span>
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "24px", fontWeight: 500, color: "#1f1b15" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>

              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#8C7B6B", fontStyle: "italic", marginTop: "12px", textAlign: "center" }}>
                Apply coupons at checkout
              </p>
            </div>

            {/* Checkout — Desktop */}
            <div className="hidden lg:block">
              <button
                onClick={handleCheckout}
                className="w-full py-4 transition-all duration-300"
                style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.14em", backgroundColor: "#AB721E", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8B6914")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#AB721E")}
              >
                PROCEED TO CHECKOUT
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "14px", marginBottom: "14px", padding: "14px 16px", backgroundColor: "#F9F3EB", border: "1px solid #E8DDD0" }}>
                {[
                  { icon: <ShieldIcon />, text: "Secure Encrypted Payments" },
                  { icon: <TruckIcon />, text: "Artisanal Delivery tracked worldwide" },
                ].map(({ icon, text }) => (
                  <div key={text} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#8C7B6B" }}>{icon}</span>
                    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4A3728", fontWeight: 400 }}>{text}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Sticky Checkout Bar — Mobile */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        style={{
          backgroundColor: "#F9F3EB",
          borderTop: "1px solid #E8DDD0",
          padding: "12px 16px",
          paddingBottom: "calc(12px + env(safe-area-inset-bottom))",
          boxShadow: "0 -4px 20px rgba(43,33,18,0.08)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#8C7B6B" }}>Total</span>
          <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "20px", color: "#1f1b15" }}>₹{total.toLocaleString("en-IN")}</span>
        </div>
        <button
          onClick={handleCheckout}
          style={{ width: "100%", padding: "14px", fontFamily: "'Jost', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.14em", backgroundColor: "#AB721E", color: "#fff", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}
        >
          PROCEED TO CHECKOUT
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </div>

    </div>
  );
};

export default CartPage;