import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../utils/axiosInstance";
import { ORDER } from "../Constants/apiRoutes";
import { ikImage } from "../utils/imageOptimization.js";

// Checkout sends the customer here as soon as Razorpay reports the payment. The server
// confirms it a moment later (checkout call or Razorpay webhook), so keep checking.
const POLL_EVERY_MS = 3000;
const POLL_FOR_MS = 90000;

const REFUND_STATUSES = ["refund_initiated", "refund_processed", "refunded"];

const OrderSuccessPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [gaveUp, setGaveUp] = useState(false);
  const [pollKey, setPollKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let timer;
    const startedAt = Date.now();

    const fetchOrder = async () => {
      try {
        const res = await api.get(ORDER.BY_ID(orderId));
        if (cancelled) return;
        const data = res.data.data;
        setOrder(data);
        setLoading(false);
        if (data?.payment?.status === "paid" || data?.status !== "payment_pending") return;
      } catch (error) {
        if (cancelled) return;
        console.error("Failed to load order:", error);
        if (error.response?.status === 404 || error.response?.status === 400) {
          setNotFound(true);
          setLoading(false);
          return;
        }
        // Network hiccup (common right after returning from a UPI app): try again
      }
      if (Date.now() - startedAt >= POLL_FOR_MS) {
        setGaveUp(true);
        setLoading(false);
        return;
      }
      timer = setTimeout(fetchOrder, POLL_EVERY_MS);
    };

    fetchOrder();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [orderId, pollKey]);

  const isPaid = order?.payment?.status === "paid" && !REFUND_STATUSES.includes(order?.status);
  const isRefund = REFUND_STATUSES.includes(order?.status);
  const isPending = !order || order.status === "payment_pending";

  if (notFound) {
    return (
      <StatusCard
        title="Order Not Found"
        message="We couldn't find this order. You can see all your orders in My Orders."
        navigate={navigate}
      />
    );
  }

  if (isRefund) {
    return (
      <StatusCard
        title="Your Refund Has Been Started"
        message={`We received your payment for order ${order.customOrderId}, but it arrived after the order had expired and the items are no longer in stock. A full refund has been initiated to your original payment method. Refunds usually reach your account within 5–7 working days.`}
        navigate={navigate}
      />
    );
  }

  if (order?.status === "cancelled") {
    return (
      <StatusCard
        title="This Order Was Not Completed"
        message={`We didn't receive a payment for order ${order.customOrderId} in time, so it was cancelled. If money was deducted from your account, it will be confirmed or refunded automatically. Please contact us if you need help.`}
        navigate={navigate}
      />
    );
  }

  if (loading || (isPending && !gaveUp)) {
    return (
      <StatusCard
        spinner
        title="Confirming Your Payment"
        message="This usually takes a few seconds. Please don't pay again or close this page."
      />
    );
  }

  if (isPending && gaveUp) {
    return (
      <StatusCard
        title="Your Payment Is Being Confirmed"
        message="This is taking a little longer than usual. If money was deducted, your order will be confirmed automatically within a few minutes and you'll get an SMS. Please don't pay again; you can check the status in My Orders."
        navigate={navigate}
        onRetry={() => {
          setGaveUp(false);
          setPollKey((k) => k + 1);
        }}
      />
    );
  }

  if (!isPaid) {
    return (
      <StatusCard
        title="Order Received"
        message={`Order ${order.customOrderId} is ${formatStatus(order.status)}. You can follow it in My Orders.`}
        navigate={navigate}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#F9F3EB",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          backgroundColor: "#fff",
          border: "1px solid #E8DDD0",
          padding: "40px",
        }}
      >
        {/* Header */}

        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "50%",
              backgroundColor: "#2D6B5A",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "32px",
            }}
          >
            ✓
          </div>

          <h1
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "42px",
              marginBottom: "10px",
            }}
          >
            Thank You For Your Order
          </h1>

          <p
            style={{
              color: "#8C7B6B",
              fontFamily: "'Jost', sans-serif",
            }}
          >
            Your payment has been received successfully.
          </p>
        </div>

        {/* Order Info */}

        <div
          style={{
            backgroundColor: "#FDF8F1",
            padding: "20px",
            marginBottom: "30px",
            border: "1px solid #E8DDD0",
          }}
        >
          <p>
            <strong>Order ID:</strong> {order.customOrderId}
          </p>

          <p>
            <strong>Status:</strong> {formatStatus(order.status)}
          </p>

          {order.payment?.paidAt && (
            <p>
              <strong>Paid At:</strong>{" "}
              {new Date(order.payment.paidAt).toLocaleString("en-IN")}
            </p>
          )}

          <p>
            <strong>Total:</strong> ₹
            {order.pricing?.total?.toLocaleString("en-IN")}
          </p>
        </div>

        {/* Items */}

        <h2
          style={{
            fontFamily: "'EB Garamond', serif",
            marginBottom: "20px",
          }}
        >
          Ordered Items
        </h2>

        {(order.items || []).map((item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              gap: "20px",
              padding: "20px 0",
              borderBottom: "1px solid #E8DDD0",
            }}
          >
            <img
              src={ikImage(item.image || item.variant?.images?.[0]?.url, 200)}
              alt={item.productName}
              loading="lazy"
              decoding="async"
              style={{
                width: "100px",
                height: "130px",
                objectFit: "cover",
              }}
            />

            <div>
              <h3>{item.productName}</h3>

              <p>Color: {item.variantName}</p>

              <p>Size: {item.size}</p>

              <p>Quantity: {item.quantity}</p>

              <p>₹{item.priceAtOrder}</p>
            </div>
          </div>
        ))}

        {/* Address */}

        {order.address && (
          <div style={{ marginTop: "40px" }}>
            <h2
              style={{
                fontFamily: "'EB Garamond', serif",
                marginBottom: "10px",
              }}
            >
              Shipping Address
            </h2>

            <p>{order.address.name}</p>
            <p>{order.address.line1}</p>
            {order.address.line2 && <p>{order.address.line2}</p>}
            <p>
              {order.address.city}, {order.address.state}
            </p>
            <p>{order.address.pincode}</p>
            <p>{order.address.phone}</p>
          </div>
        )}

        <ActionButtons navigate={navigate} />
      </div>
    </div>
  );
};

const formatStatus = (status) =>
  status ? (status.charAt(0).toUpperCase() + status.slice(1)).replace(/_/g, " ") : "N/A";

// Single message card for every state other than a confirmed order
const StatusCard = ({ title, message, spinner, navigate, onRetry }) => (
  <div
    style={{
      minHeight: "70vh",
      backgroundColor: "#F9F3EB",
      padding: "40px 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        maxWidth: "560px",
        width: "100%",
        backgroundColor: "#fff",
        border: "1px solid #E8DDD0",
        padding: "40px 28px",
        textAlign: "center",
      }}
    >
      {spinner && (
        <div
          aria-hidden="true"
          className="animate-spin"
          style={{
            width: "40px",
            height: "40px",
            margin: "0 auto 24px",
            borderRadius: "50%",
            border: "3px solid #E8DDD0",
            borderTopColor: "#AB721E",
          }}
        />
      )}

      <h1
        style={{
          fontFamily: "'EB Garamond', serif",
          fontSize: "32px",
          color: "#2B2112",
          marginBottom: "12px",
        }}
      >
        {title}
      </h1>

      <p
        role="status"
        style={{
          color: "#8C7B6B",
          fontFamily: "'Jost', sans-serif",
          lineHeight: 1.6,
        }}
      >
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            marginTop: "24px",
            backgroundColor: "#fff",
            color: "#AB721E",
            border: "1px solid #AB721E",
            padding: "10px 22px",
            cursor: "pointer",
          }}
        >
          Check Again
        </button>
      )}

      {navigate && <ActionButtons navigate={navigate} centered />}
    </div>
  </div>
);

const ActionButtons = ({ navigate, centered }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "15px",
      marginTop: "40px",
      justifyContent: centered ? "center" : "flex-start",
    }}
  >
    <button
      onClick={() => navigate("/account", { state: { tab: "orders" } })}
      style={{
        backgroundColor: "#AB721E",
        color: "#fff",
        border: "none",
        padding: "12px 24px",
        cursor: "pointer",
      }}
    >
      View Orders
    </button>

    <button
      onClick={() => navigate("/")}
      style={{
        backgroundColor: "#fff",
        color: "#AB721E",
        border: "1px solid #AB721E",
        padding: "12px 24px",
        cursor: "pointer",
      }}
    >
      Continue Shopping
    </button>
  </div>
);

export default OrderSuccessPage;
