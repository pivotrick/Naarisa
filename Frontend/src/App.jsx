import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Common/Navbar";
import AnnouncementBar from "./Components/Common/AnnouncementBar";
import Footer from "./Components/Common/Footer";
import ScrollToTop from "./ScrollToTop";
import NamePromptGate from "./Components/Common/NamePromptGate";
import useCategoryStore from "./Store/useCategoryStore";

import Home from "./Pages/Home";

// Every other page is downloaded only when it is first visited, which keeps the
// home page's JavaScript small.
const ProductPage = lazy(() => import("./Pages/ProductPage"));
const CategoryPage = lazy(() => import("./Pages/CategoryPage"));
const CartPage = lazy(() => import("./Pages/CartPage"));
const CheckoutPage = lazy(() => import("./Pages/CheckoutPage"));
const AuthPage = lazy(() => import("./Pages/Authpage"));
const AboutPage = lazy(() => import("./Pages/AboutPage"));
const AccountPage = lazy(() => import("./Pages/AccountPage"));
const BestSellersPage = lazy(() => import("./Pages/BestSellersPage"));
const OrderSuccessPage = lazy(() => import("./Pages/OrderSuccessPage"));
const AllProductsPage = lazy(() => import("./Pages/AllProductsPage"));
const NewArrivalsPage = lazy(() => import("./Pages/Newarrivalspage"));
const ContactPage = lazy(() => import("./Pages/ContactPage"));
const ReturnRefundPage = lazy(() => import("./Pages/ReturnRefundPage"));
const TermsPage = lazy(() => import("./Pages/TermsPage"));
const PrivacyPolicyPage = lazy(() => import("./Pages/PrivacyPolicyPage"));


function App() {
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <BrowserRouter>
      <ScrollToTop />

      {/* Global Components */}
      <AnnouncementBar />
      <Navbar />

      {/* Routes */}
      <NamePromptGate>
        <Suspense fallback={<div style={{ minHeight: "100vh", backgroundColor: "#F9F3EB" }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/all-products" element={<AllProductsPage />} />
            <Route path="/new-in" element={<NewArrivalsPage />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/best-sellers" element={<BestSellersPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/return-refund-policy" element={<ReturnRefundPage />} />
            <Route path="/terms-and-condition" element={<TermsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          </Routes>
        </Suspense>
      </NamePromptGate>
      <Footer />

    </BrowserRouter>
  );
}

export default App;