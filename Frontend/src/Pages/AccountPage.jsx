import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/axiosInstance.js";
import OrderTrackingWidget from "../Components/Common/OrderTrackingWidget.jsx";
import AddressModal from "../Components/Common/AddressModal.jsx";
import { ORDER, USER } from "../Constants/apiRoutes.js";
import { ikImage } from "../utils/imageOptimization.js";

// ── Helpers ───────────────────────────────────────────────────────────────────
const initials = (name = "") =>
  name.trim().split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const fmtPrice = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// ── Icons ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "#8C7B6B" }) => {
  const paths = {
    profile: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z",
    orders: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    wishlist: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
    address: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0zM12 13a3 3 0 100-6 3 3 0 000 6z",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    plus: "M12 5v14M5 12h14",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    chevron: "M9 18l6-6-6-6",
    menu: "M3 12h18M3 6h18M3 18h18",
    back: "M19 12H5M12 19l-7-7 7-7",
    package: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[name]} />
    </svg>
  );
};

// ── Status Badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    payment_pending: { label: "Pending", bg: "#FEF3C7", color: "#92400E" },
    confirmed: { label: "Confirmed", bg: "#D1FAE5", color: "#065F46" },
    dispatched: { label: "Dispatched", bg: "#DBEAFE", color: "#1E40AF" },
    delivered: { label: "Delivered", bg: "#F0FDF4", color: "#166534" },
    cancelled: { label: "Cancelled", bg: "#FEE2E2", color: "#991B1B" },
  };
  const s = map[status] || { label: status, bg: "#F5E6D0", color: "#4A3728" };
  return (
    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", padding: "3px 10px", backgroundColor: s.bg, color: s.color }}>
      {s.label.toUpperCase()}
    </span>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const Skel = ({ w = "100%", h = "16px", mb = "0" }) => (
  <div style={{ width: w, height: h, backgroundColor: "#E8DDD0", marginBottom: mb, borderRadius: "2px" }} />
);

// ── Indian States ─────────────────────────────────────────────────────────────
const STATES = ["Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh"];

// ── Sidebar Nav Item ──────────────────────────────────────────────────────────
const NavItem = ({ icon, label, active, onClick, danger }) => (
  <button
    onClick={onClick}
    style={{
      width: "100%", display: "flex", alignItems: "center", gap: "12px",
      padding: "12px 16px", backgroundColor: active ? "#2B2112" : "transparent",
      border: "none", borderTop: "1px solid #F5E6D0", cursor: "pointer",
      textAlign: "left", transition: "all 0.15s",
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.backgroundColor = "#F9F3EB"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.backgroundColor = "transparent"; }}
  >
    <Icon name={icon} size={15} color={active ? "#F5E6D0" : danger ? "#C4727A" : "#8C7B6B"} />
    <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: active ? "#F5E6D0" : danger ? "#C4727A" : "#4A3728" }}>
      {label}
    </span>
  </button>
);

// ── SECTION: Profile ──────────────────────────────────────────────────────────
const ProfileSection = ({ profile, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: profile.name || "", email: profile.email || "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    try {
      const res = await api.put(USER.PROFILE, form);
      if (res.data.success) {
        onUpdate(res.data.data);
        setEditing(false);
        setError("");
        const stored = JSON.parse(localStorage.getItem("naarisa-user") || "{}");
        localStorage.setItem("naarisa-user", JSON.stringify({ ...stored, name: form.name, email: form.email }));
      }
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    } finally { setSaving(false); }
  };

  const inp = { width: "100%", boxSizing: "border-box", padding: "10px 12px", fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#1f1b15", backgroundColor: "#FDF8F1", border: "1px solid #E8DDD0", outline: "none" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "28px", fontWeight: 400, color: "#1f1b15", marginBottom: "4px" }}>My Profile</h1>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", fontStyle: "italic", color: "#8C7B6B" }}>Manage your personal information.</p>
        </div>
        {!editing && (
          <button onClick={() => setEditing(true)}
            style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", border: "1px solid #1f1b15", backgroundColor: "transparent", color: "#1f1b15", fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", cursor: "pointer", transition: "all 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#1f1b15"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1f1b15"; }}>
            <Icon name="edit" size={13} color="currentColor" /> EDIT
          </button>
        )}
      </div>

      <div style={{ border: "1px solid #E8DDD0", backgroundColor: "#fff", padding: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid #F5E6D0" }}>
          <Icon name="profile" size={14} color="#AB721E" />
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "#4A3728" }}>PERSONAL INFORMATION</span>
        </div>

        {editing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#8C7B6B", marginBottom: "6px" }}>FULL NAME</p>
              <input value={form.name} onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); setError(""); }} style={inp}
                onFocus={(e) => (e.target.style.borderColor = "#AB721E")} onBlur={(e) => (e.target.style.borderColor = "#E8DDD0")} />
            </div>
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#8C7B6B", marginBottom: "6px" }}>EMAIL ADDRESS</p>
              <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="your@email.com" style={inp}
                onFocus={(e) => (e.target.style.borderColor = "#AB721E")} onBlur={(e) => (e.target.style.borderColor = "#E8DDD0")} />
            </div>
            <div>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#8C7B6B", marginBottom: "6px" }}>PHONE NUMBER</p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#8C7B6B" }}>+91 {profile.phone} <span style={{ fontSize: "11px", color: "#C4A882" }}>(cannot be changed)</span></p>
            </div>
            {error && <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#C4727A" }}>{error}</p>}
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => { setEditing(false); setForm({ name: profile.name, email: profile.email || "" }); setError(""); }}
                style={{ flex: 1, padding: "11px", fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", border: "1px solid #E8DDD0", backgroundColor: "transparent", color: "#8C7B6B", cursor: "pointer" }}>
                CANCEL
              </button>
              <button onClick={handleSave} disabled={saving}
                style={{ flex: 2, padding: "11px", fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", backgroundColor: saving ? "#C4A882" : "#AB721E", color: "#fff", border: "none", cursor: saving ? "not-allowed" : "pointer" }}
                onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#8B6914"; }}
                onMouseLeave={(e) => { if (!saving) e.currentTarget.style.backgroundColor = "#AB721E"; }}>
                {saving ? "SAVING..." : "SAVE CHANGES"}
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "20px" }}>
            {[
              { label: "FULL NAME", value: profile.name },
              { label: "EMAIL ADDRESS", value: profile.email || <span style={{ color: "#C4A882", fontStyle: "italic", fontSize: "13px" }}>Not added</span> },
              { label: "PHONE NUMBER", value: `+91 ${profile.phone}` },
              { label: "MEMBER SINCE", value: fmtDate(profile.createdAt) },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#8C7B6B", marginBottom: "6px" }}>{label}</p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "15px", color: "#1f1b15" }}>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── SECTION: Orders ───────────────────────────────────────────────────────────
const OrdersSection = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(USER.ORDERS)
      .then((r) => {
        if (r.data.success) {
          console.log(r.data.data)
          const paidOrders = r.data.data.filter(order => order.payment?.status === "paid");
          setOrders(paidOrders);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Skel w="200px" h="34px" mb="20px" />
      {[1, 2, 3].map((i) => <div key={i} style={{ border: "1px solid #E8DDD0", padding: "20px" }}><Skel w="50%" h="14px" mb="10px" /><Skel w="30%" h="12px" /></div>)}
    </div>
  );

  const handleTrack = async (orderId) => {
    setTrackingLoading(true);
    try {
      const res = await api.get(ORDER.ORDER_TRACK(orderId));
      if (res.data.success) setTracking({ orderId, ...res.data.tracking });
    } catch (err) {
      console.error(err);
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "28px", fontWeight: 400, color: "#1f1b15", marginBottom: "4px" }}>My Orders</h1>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", fontStyle: "italic", color: "#8C7B6B" }}>{orders.length} order{orders.length !== 1 ? "s" : ""} placed</p>
      </div>

      {orders.length === 0 ? (
        <div style={{ border: "1px dashed #E8DDD0", padding: "60px 20px", textAlign: "center" }}>
          <Icon name="package" size={36} color="#C4A882" />
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "20px", color: "#1f1b15", margin: "16px 0 8px" }}>No orders yet</p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8C7B6B", marginBottom: "20px" }}>Your orders will appear here once you place one.</p>
          <button onClick={() => navigate("/all-products")} style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", padding: "12px 24px", backgroundColor: "#2B2112", color: "#F5E6D0", border: "none", cursor: "pointer" }}>EXPLORE COLLECTION</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {orders.map((order) => (
            <div key={order._id} style={{ border: "1px solid #E8DDD0", backgroundColor: "#fff", transition: "border-color 0.2s" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#C4A882")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#E8DDD0")}>

              <div style={{ padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer", flexWrap: "wrap", gap: "8px" }}
                onClick={() => setExpanded(expanded === order._id ? null : order._id)}>
                <div>
                  {/* ✅ Changed: Display customOrderId instead of _id */}
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: "4px" }}>
                    ORDER #{order.customOrderId || order._id?.slice(-6).toUpperCase()}
                  </p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#4A3728" }}>
                    {fmtDate(order.createdAt)} · {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "15px", fontWeight: 600, color: "#1f1b15" }}>{fmtPrice(order.pricing?.total)}</p>
                  <StatusBadge status={order.status} />
                  <span style={{ color: "#8C7B6B", display: "inline-flex", transform: expanded === order._id ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
                    <Icon name="chevron" size={14} color="#8C7B6B" />
                  </span>
                </div>
              </div>

              {expanded === order._id && (
                <div style={{ borderTop: "1px solid #F5E6D0", padding: "14px 16px" }}>
                  {/* ✅ NEW: Display email and customOrderId at top */}
                  <div style={{ backgroundColor: "#F9F3EB", padding: "12px 14px", borderRadius: "4px", marginBottom: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", flexWrap: "wrap" }}>
                      <div>
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: "4px" }}>ORDER ID</p>
                        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 600, color: "#1f1b15" }}>{order.customOrderId}</p>
                      </div>
                      {order.email && (
                        <div>
                          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: "4px" }}>EMAIL</p>
                          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#1f1b15" }}>{order.email}</p>
                        </div>
                      )}
                    </div>
                    <OrderTrackingWidget
                      orderId={order._id}
                    />
                  </div>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "14px" }}>
                    {order.items?.map((item, i) => (
                      <div key={i} style={{ display: "flex", gap: "10px", backgroundColor: "#F9F3EB", padding: "10px", flex: "1 1 200px" }}>
                        {item.image ? (
                          <img
                            src={ikImage(item.image, 160)}
                            alt={item.productName}
                            loading="lazy"
                            decoding="async"
                            style={{
                              width: "44px",
                              aspectRatio: "3/4",
                              objectFit: "cover",
                              flexShrink: 0
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "44px",
                              aspectRatio: "3/4",
                              backgroundColor: "#E8DDD0",
                              flexShrink: 0
                            }}
                          />
                        )}
                        <div>
                          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", color: "#1f1b15", marginBottom: "2px" }}>{item.productName}</p>
                          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#8C7B6B" }}>{item.variantName} · {item.size} · ×{item.quantity}</p>
                          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 600, color: "#AB721E", marginTop: "4px" }}>{fmtPrice(item.priceAtOrder * item.quantity)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTrack(order._id);
                      }}
                      disabled={trackingLoading}
                      style={{
                        padding: "11px 20px",
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        border: "1px solid #4A3728",
                        backgroundColor: "#fff",
                        color: "#4A3728",
                        cursor: trackingLoading ? "not-allowed" : "pointer",
                      }}
                    >
                      {trackingLoading ? "CHECKING..." : "SHOW TRACKING STATUS"}
                    </button> */}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Returns are handled by the support team until a self-serve returns flow exists
                        navigate("/contact", {
                          state: {
                            subject: "Returns & Exchange",
                            message: `I'd like to request a return for order ${order.customOrderId}.

Reason: `,
                          },
                        });
                      }}
                      style={{
                        padding: "11px 20px",
                        fontFamily: "'Jost', sans-serif",
                        fontSize: "11px",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        border: "1px solid #AB721E",
                        backgroundColor: "#fff",
                        color: "#AB721E",
                        cursor: "pointer",
                      }}
                    >
                      REQUEST RETURN
                    </button>
                  </div>

                  {tracking?.orderId === order._id && (
                    <div style={{ marginTop: "12px", backgroundColor: "#F9F3EB", padding: "12px 14px" }}>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: "6px" }}>
                        CURRENT STATUS
                      </p>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#1f1b15", marginBottom: "8px" }}>
                        {tracking.currentStatus}
                      </p>
                      {tracking.scans?.map((s, i) => (
                        <p key={i} style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#8C7B6B", marginBottom: "3px" }}>
                          {s.date} — {s.status} ({s.location})
                        </p>
                      ))}
                    </div>
                  )}
                  <br />

                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, backgroundColor: "#F9F3EB", padding: "12px 14px", minWidth: "160px" }}>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: "8px" }}>DELIVERY ADDRESS</p>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4A3728", lineHeight: 1.7 }}>
                        {order.address?.name}<br />
                        {order.address?.line1}{order.address?.line2 ? `, ${order.address.line2}` : ""}<br />
                        {order.address?.city}, {order.address?.state} — {order.address?.pincode}
                      </p>
                    </div>
                    <div style={{ flex: 1, backgroundColor: "#F9F3EB", padding: "12px 14px", minWidth: "160px" }}>
                      <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: "#8C7B6B", marginBottom: "8px" }}>PRICING</p>
                      {[
                        ["Subtotal", fmtPrice(order.pricing?.subtotal)],
                        ...(order.pricing?.discount > 0 ? [["Discount", `− ${fmtPrice(order.pricing.discount)}`]] : []),
                        ["Total", fmtPrice(order.pricing?.total)],
                      ].map(([l, v]) => (
                        <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#8C7B6B" }}>{l}</span>
                          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", fontWeight: l === "Total" ? 700 : 400, color: "#1f1b15" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

// ── SECTION: Wishlist ─────────────────────────────────────────────────────────
const WishlistSection = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(USER.WISHLIST)
      .then((r) => {
        if (r.data.success) {
          console.log(r.data)
          setItems(r.data.data || []);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (variantId) => {
    try {
      await api.delete(USER.WISHLIST_ITEM(variantId));
      setItems((p) => p.filter((i) => (i.variant?._id || i._id) !== variantId));
    } catch (err) { console.error(err); }
  };

  if (loading) return (
    <div>
      <Skel w="160px" h="34px" mb="24px" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "14px" }}>
        {[1, 2, 3, 4].map((i) => <div key={i}><Skel w="100%" h="200px" mb="8px" /><Skel w="70%" h="13px" mb="5px" /><Skel w="40%" h="13px" /></div>)}
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "28px", fontWeight: 400, color: "#1f1b15", marginBottom: "4px" }}>Wishlist</h1>
        <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", fontStyle: "italic", color: "#8C7B6B" }}>{items.length} saved item{items.length !== 1 ? "s" : ""}</p>
      </div>

      {items.length === 0 ? (
        <div style={{ border: "1px dashed #E8DDD0", padding: "60px 20px", textAlign: "center" }}>
          <Icon name="wishlist" size={36} color="#C4A882" />
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "20px", color: "#1f1b15", margin: "16px 0 8px" }}>Your wishlist is empty</p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8C7B6B", marginBottom: "20px" }}>Save items you love to buy them later.</p>
          <button onClick={() => navigate("/all-products")} style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", padding: "12px 24px", backgroundColor: "#2B2112", color: "#F5E6D0", border: "none", cursor: "pointer" }}>EXPLORE COLLECTION</button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "14px" }}>
          {items.map((item) => {
            const variant = item.variant || item;
            const variantId = variant._id;
            return (
              <div key={variantId} style={{ position: "relative", cursor: "pointer" }} onClick={() => variant.slug && navigate(`/product/${variant.slug}`)}>
                <div style={{ aspectRatio: "3/4", overflow: "hidden", backgroundColor: "#F5E6D0", marginBottom: "10px", position: "relative" }}>
                  {variant.images?.[0]?.url
                    ? <img src={ikImage(variant.images[0].url, 400)} alt="" loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", color: "#8C7B6B", letterSpacing: "0.1em" }}>NAARISA</span></div>
                  }
                  <button onClick={(e) => { e.stopPropagation(); handleRemove(variantId); }}
                    style={{ position: "absolute", top: "8px", right: "8px", width: "26px", height: "26px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.9)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name="x" size={12} color="#C4727A" />
                  </button>
                </div>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", color: "#1f1b15", marginBottom: "2px", lineHeight: 1.3 }}>{item.productName || variant.productId?.name}</p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#8C7B6B", marginBottom: "4px" }}>{variant.color?.name}</p>
                <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", fontWeight: 600, color: "#AB721E" }}>{fmtPrice(variant.discountPrice ?? variant.productId?.basePrice ?? 0)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ── SECTION: Addresses ────────────────────────────────────────────────────────
const AddressesSection = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    api.get(USER.ADDRESSES)
      .then((r) => { if (r.data.success) setAddresses(r.data.data || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (form) => {
    try {
      const res = modal?._id
        ? await api.put(USER.ADDRESS_BY_ID(modal._id), form)
        : await api.post(USER.ADDRESSES, form);
      if (res.data.success) setAddresses(res.data.data);
      setModal(null);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this address?")) return;
    try {
      const res = await api.delete(USER.ADDRESS_BY_ID(id));
      if (res.data.success) setAddresses(res.data.data);
    } catch (err) { console.error(err); }
  };

  const handleSetDefault = async (id) => {
    try {
      const res = await api.put(USER.SET_DEFAULT(id), {});
      if (res.data.success) setAddresses(res.data.data);
    } catch (err) { console.error(err); }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "'EB Garamond', serif", fontSize: "28px", fontWeight: 400, color: "#1f1b15", marginBottom: "4px" }}>Addresses</h1>
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "14px", fontStyle: "italic", color: "#8C7B6B" }}>Manage your saved delivery addresses</p>
        </div>
        <button onClick={() => setModal("add")}
          style={{ display: "flex", alignItems: "center", gap: "7px", padding: "10px 18px", backgroundColor: "#2B2112", color: "#F5E6D0", fontFamily: "'Jost', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", border: "none", cursor: "pointer", transition: "background 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#AB721E")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2B2112")}>
          <Icon name="plus" size={13} color="#F5E6D0" /> ADD ADDRESS
        </button>
      </div>

      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
          {[1, 2].map((i) => <div key={i} style={{ border: "1px solid #E8DDD0", padding: "20px" }}><Skel w="50%" h="14px" mb="10px" /><Skel w="100%" h="12px" mb="6px" /><Skel w="70%" h="12px" /></div>)}
        </div>
      ) : addresses.length === 0 ? (
        <div style={{ border: "1px dashed #E8DDD0", padding: "60px 20px", textAlign: "center" }}>
          <Icon name="address" size={36} color="#C4A882" />
          <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "20px", color: "#1f1b15", margin: "16px 0 8px" }}>No addresses saved</p>
          <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8C7B6B" }}>Add an address to speed up checkout.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "12px" }}>
          {addresses.map((addr) => (
            <div key={addr._id} style={{ border: addr.isDefault ? "1.5px solid #AB721E" : "1px solid #E8DDD0", backgroundColor: addr.isDefault ? "#FDF8F1" : "#fff", padding: "18px 20px", position: "relative" }}>
              {addr.isDefault && (
                <span style={{ position: "absolute", top: "12px", right: "12px", fontFamily: "'Jost', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", backgroundColor: "#AB721E", color: "#fff", padding: "2px 8px" }}>DEFAULT</span>
              )}
              <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#8C7B6B", backgroundColor: "#F5E6D0", padding: "2px 8px", display: "inline-block", marginBottom: "10px" }}>{addr.label?.toUpperCase()}</span>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "14px", fontWeight: 600, color: "#1f1b15", marginBottom: "6px" }}>{addr.name}</p>
              <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4A3728", lineHeight: 1.7 }}>
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                {addr.city}, {addr.state} — {addr.pincode}<br />
                +91 {addr.phone}
              </p>
              <div style={{ display: "flex", gap: "6px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #F5E6D0", flexWrap: "wrap" }}>
                {!addr.isDefault && (
                  <button onClick={() => handleSetDefault(addr._id)}
                    style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", padding: "5px 10px", border: "1px solid #C4A882", backgroundColor: "transparent", color: "#8C7B6B", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", transition: "all 0.15s" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#AB721E"; e.currentTarget.style.color = "#AB721E"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#C4A882"; e.currentTarget.style.color = "#8C7B6B"; }}>
                    <Icon name="check" size={11} color="currentColor" /> SET DEFAULT
                  </button>
                )}
                <button onClick={() => setModal(addr)}
                  style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", padding: "5px 10px", border: "1px solid #E8DDD0", backgroundColor: "transparent", color: "#8C7B6B", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1f1b15"; e.currentTarget.style.color = "#1f1b15"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; e.currentTarget.style.color = "#8C7B6B"; }}>
                  EDIT
                </button>
                <button onClick={() => handleDelete(addr._id)}
                  style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", padding: "5px 10px", border: "1px solid #E8DDD0", backgroundColor: "transparent", color: "#8C7B6B", cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.15s" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#C4727A"; e.currentTarget.style.borderColor = "#C4727A"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#8C7B6B"; e.currentTarget.style.borderColor = "#E8DDD0"; }}>
                  <Icon name="trash" size={12} color="currentColor" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && <AddressModal existing={modal === "add" ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}
    </div>
  );
};

// ── Nav config ────────────────────────────────────────────────────────────────
const NAV = [
  { id: "profile", icon: "profile", label: "MY PROFILE" },
  { id: "orders", icon: "orders", label: "ORDERS" },
  { id: "wishlist", icon: "wishlist", label: "WISHLIST" },
  { id: "addresses", icon: "address", label: "ADDRESSES" },
];

// ── Mobile Bottom Tab Bar ─────────────────────────────────────────────────────
const MobileTabBar = ({ activeTab, setActiveTab, onLogout }) => (
  <div style={{
    position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
    backgroundColor: "#fff", borderTop: "1px solid #E8DDD0",
    display: "flex", alignItems: "stretch",
    boxShadow: "0 -4px 20px rgba(43,33,18,0.08)",
  }}>
    {NAV.map((item) => {
      const active = activeTab === item.id;
      return (
        <button key={item.id} onClick={() => setActiveTab(item.id)}
          style={{
            flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: "4px", padding: "10px 4px",
            backgroundColor: "transparent", border: "none", cursor: "pointer",
            borderTop: active ? "2px solid #AB721E" : "2px solid transparent",
            transition: "all 0.15s",
          }}>
          <Icon name={item.icon} size={18} color={active ? "#AB721E" : "#8C7B6B"} />
          <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: active ? "#AB721E" : "#8C7B6B" }}>
            {item.label.split(" ").pop()}
          </span>
        </button>
      );
    })}
    <button onClick={onLogout}
      style={{
        flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", gap: "4px", padding: "10px 4px",
        backgroundColor: "transparent", border: "none", borderTop: "2px solid transparent",
        cursor: "pointer",
      }}>
      <Icon name="logout" size={18} color="#C4727A" />
      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.1em", color: "#C4727A" }}>LOGOUT</span>
    </button>
  </div>
);

// ── Main Account Page ─────────────────────────────────────────────────────────
const AccountPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialTab = () => {
    const requestedTab = location.state?.tab;
    return NAV.some((n) => n.id === requestedTab) ? requestedTab : "profile";
  };

  const [activeTab, setActiveTab] = useState(getInitialTab);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("naarisa-token");
    if (!token) { navigate("/auth?redirect=/account"); return; }
    api.get(USER.PROFILE)
      .then((r) => { if (r.data.success) setProfile(r.data.data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("naarisa-token");
    localStorage.removeItem("naarisa-user");
    navigate("/");
  };

  if (loading) return (
    <div style={{ backgroundColor: "#F9F3EB", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "260px" }}>
        <Skel w="100%" h="120px" mb="8px" />
        {[1, 2, 3, 4].map((i) => <Skel key={i} w="100%" h="44px" />)}
      </div>
    </div>
  );

  if (!profile) return null;

  return (
    <div style={{ backgroundColor: "#F9F3EB", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: isMobile ? "20px 16px 80px" : "40px 20px" }}>

        {/* ── Desktop: sidebar + content ── */}
        {!isMobile && (
          <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", alignItems: "start" }}>
            {/* Sidebar */}
            <div style={{ position: "sticky", top: "24px" }}>
              <div style={{ border: "1px solid #E8DDD0", backgroundColor: "#fff", padding: "24px 20px", textAlign: "center", marginBottom: "8px" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#F5E6D0", border: "2px solid #C4A882", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                  <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "20px", fontWeight: 500, color: "#AB721E" }}>{initials(profile.name)}</span>
                </div>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "17px", color: "#1f1b15", marginBottom: "6px" }}>{profile.name}</p>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.12em", color: "#AB721E", backgroundColor: "#F5E6D0", padding: "2px 10px" }}>MEMBER</span>
              </div>
              <div style={{ border: "1px solid #E8DDD0", backgroundColor: "#fff", overflow: "hidden", marginBottom: "8px" }}>
                {NAV.map((item) => (
                  <NavItem key={item.id} icon={item.icon} label={item.label} active={activeTab === item.id} onClick={() => setActiveTab(item.id)} />
                ))}
              </div>
              <div style={{ border: "1px solid #E8DDD0", backgroundColor: "#fff", overflow: "hidden" }}>
                <NavItem icon="logout" label="LOGOUT" danger onClick={handleLogout} />
              </div>
            </div>

            {/* Content */}
            <div>
              {activeTab === "profile" && <ProfileSection profile={profile} onUpdate={setProfile} />}
              {activeTab === "orders" && <OrdersSection />}
              {activeTab === "wishlist" && <WishlistSection />}
              {activeTab === "addresses" && <AddressesSection />}
            </div>
          </div>
        )}

        {/* ── Mobile: profile header + content ── */}
        {isMobile && (
          <div>
            {/* Compact profile strip */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#fff", border: "1px solid #E8DDD0", padding: "14px 16px", marginBottom: "16px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: "#F5E6D0", border: "2px solid #C4A882", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "'EB Garamond', serif", fontSize: "16px", fontWeight: 500, color: "#AB721E" }}>{initials(profile.name)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'EB Garamond', serif", fontSize: "16px", color: "#1f1b15", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profile.name}</p>
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.12em", color: "#AB721E", backgroundColor: "#F5E6D0", padding: "2px 8px" }}>MEMBER</span>
              </div>
            </div>

            {/* Active section label */}
            <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", color: "#8C7B6B", marginBottom: "12px" }}>
              {NAV.find((n) => n.id === activeTab)?.label}
            </p>

            {/* Content */}
            {activeTab === "profile" && <ProfileSection profile={profile} onUpdate={setProfile} />}
            {activeTab === "orders" && <OrdersSection />}
            {activeTab === "wishlist" && <WishlistSection />}
            {activeTab === "addresses" && <AddressesSection />}
          </div>
        )}
      </div>

      {/* Mobile bottom tab bar */}
      {isMobile && <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />}
    </div>
  );
};

export default AccountPage;