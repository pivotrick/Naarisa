import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import useCartStore from "../../Store/useCartStore.js";
import useCategoryStore, { categoryPath } from "../../Store/useCategoryStore.js";

import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";

import logo from "../../assets/naarisa-logo.webp";
import { BASE, PRODUCT } from "../../Constants/apiRoutes.js";
import { ikImage } from "../../utils/imageOptimization.js";

const BASE_URL = BASE.ROUTE;

const navLinks = [
  {
    title: "SHOP ALL",
    path: "/all-products",
  },
  {
    title: "NEW IN",
    path: "/new-in",
  },
  {
    title: "CATEGORIES",
    dropdown: [], // filled from the admin-managed categories (useCategoryStore)
  },
  {
    title: "BEST SELLERS",
    path: "/best-sellers",
  },
  {
    title: "OUR STORY",
    path: "/about",
  },
];

const CategoryBadge = ({ text }) => (
  <span className="ml-2 inline-block rounded-full bg-[#AB721E] px-2 py-[2px] align-middle font-['Jost'] text-[9px] font-bold tracking-[0.12em] text-white">
    {text}
  </span>
);

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [suggestions, setSuggestions] = useState([]);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);
  const categories = useCategoryStore((state) => state.categories);
  const links = navLinks.map((link) =>
    link.title === "CATEGORIES"
      ? { ...link, dropdown: categories.map((c) => ({ title: c.label, path: categoryPath(c), badge: c.badge })) }
      : link
  );

  useEffect(() => {
    if (!searchQuery.trim()) { setSuggestions([]); return; }
    // Debounce + call your API
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${BASE_URL}${PRODUCT.SEARCH_PRODUCTS}?q=${encodeURIComponent(searchQuery)}`
        );

        console.log(res.data)

        const data = await res.json();

        console.log("Search Response:", data);

        if (data.success) {
          setSuggestions(data.data || []);
        }
      } catch (e) {
        console.log("Error from Navbar :", e);
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 50);
  }, [searchOpen]);

  useEffect(() => {
    setSearchOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* NAVBAR */}
      <header
        className="
        sticky
        top-0
        z-50
        w-full
        border-b
        border-[#e8ddd0]
        bg-[#f6ece2]/90
        backdrop-blur-md
      "
      >
        <div
          className="
          relative
          mx-auto
          flex
          h-[92px]
          max-w-[1400px]
          items-center
          justify-between
          px-5
          sm:px-6
          md:h-[94px]
          md:px-10
          xl:h-[82px]
          xl:px-12
        "
        >
          {/* LEFT SIDE */}
          <div className="flex items-center lg:gap-6">

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="
              flex
              items-center
              justify-center
              text-[30px]
              text-[#1f1b15]
              lg:hidden
            "
            >
              <FiMenu />
            </button>

            {/* DESKTOP LOGO */}
            <Link
              to="/"
              className="
              hidden
              transition-transform
              duration-300
              hover:scale-[1.03]
              lg:flex
            "
            >
              <img
                src={logo}
                alt="Naarisa"
                className="
                  h-14
                  w-auto
                  object-contain
                  xl:h-12
                "
              />
            </Link>
          </div>

          {/* MOBILE/TABLET CENTER LOGO */}
          <Link
            to="/"
            className="
            absolute
            left-1/2
            top-1/2
            flex
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            transition-transform
            duration-300
            hover:scale-[1.03]
            lg:hidden
          "
          >
            <img
              src={logo}
              alt="Naarisa"
              className="
                h-14
                w-auto
                object-contain
                md:h-16
              "
            />
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden flex-1 justify-center lg:flex">
            <ul
              className="
              flex
              items-center
              gap-5
              xl:gap-8
              2xl:gap-12
            "
            >
              {links.map((link, index) => (
                <li
                  key={index}
                  className="group relative"
                >
                  {!link.dropdown ? (
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `
                        relative
                        font-['Jost']
                        text-[13px]
                        xl:text-[14px]
                        2xl:text-[15px]
                        font-normal
                        tracking-[0.14em]
                        transition-all
                        duration-300
                        ${isActive
                          ? "text-[#7c5400]"
                          : "text-[#504537] hover:text-[#7c5400]"
                        }
                      `
                      }
                    >
                      {({ isActive }) => (
                        <>
                          {link.title}

                          <span
                            className={`
                              absolute
                              left-0
                              -bottom-[8px]
                              h-[1px]
                              bg-[#7c5400]
                              transition-all
                              duration-300
                              ${isActive
                                ? "w-full"
                                : "w-0 group-hover:w-full"
                              }
                            `}
                          />
                        </>
                      )}
                    </NavLink>
                  ) : (
                    <>
                      {/* DROPDOWN BUTTON */}
                      <button
                        className="
                        relative
                        font-['Jost']
                        text-[13px]
                        xl:text-[14px]
                        2xl:text-[15px]
                        font-normal
                        tracking-[0.14em]
                        text-[#504537]
                        transition-all
                        duration-300
                        hover:text-[#7c5400]
                      "
                      >
                        {link.title}

                        <span
                          className="
                          absolute
                          left-0
                          -bottom-[8px]
                          h-[1px]
                          w-0
                          bg-[#7c5400]
                          transition-all
                          duration-300
                          group-hover:w-full
                        "
                        />
                      </button>

                      {/* DROPDOWN MENU */}
                      <div
                        className="
                        invisible
                        absolute
                        left-1/2
                        top-[180%]
                        z-50
                        w-[240px]
                        -translate-x-1/2
                        rounded-[12px]
                        border
                        border-[#eadcc8]
                        bg-[#fff8f3]
                        p-3
                        opacity-0
                        shadow-[0_8px_30px_rgba(30,26,20,0.08)]
                        transition-all
                        duration-300
                        group-hover:visible
                        group-hover:opacity-100
                      "
                      >
                        <div className="flex flex-col">
                          {link.dropdown.map((item, idx) => (
                            <Link
                              key={idx}
                              to={item.path}
                              className="
                              rounded-[8px]
                              px-4
                              py-3
                              font-['Jost']
                              text-[15px]
                              text-[#504537]
                              transition-all
                              duration-300
                              hover:bg-[#f6ece2]
                              hover:text-[#7c5400]
                            "
                            >
                              {item.title}
                              {item.badge && <CategoryBadge text={item.badge} />}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4 sm:gap-5">

            {/* SEARCH */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center justify-center text-[22px] text-[#1f1b15] 
             transition duration-300 hover:text-[#7c5400] md:text-[23px] xl:text-[20px]"
            >
              <FiSearch />
            </button>

            {/* CART */}
            <Link
              to="/cart"
              className="
    relative
    flex
    items-center
    justify-center
    text-[22px]
    text-[#1f1b15]
    transition
    duration-300
    hover:text-[#7c5400]
    md:text-[23px]
    xl:text-[20px]
  "
            >
              <FiShoppingBag />

              {cartCount > 0 && (
                <span
                  className="
        absolute
        -top-1.5
        -right-2
        flex
        h-[17px]
        min-w-[17px]
        items-center
        justify-center
        rounded-full
        bg-[#AB721E]
        px-1
        text-[10px]
        font-semibold
        text-white
        font-['Jost']
        leading-none
      "
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {/* USER */}
            <Link
              to="/account"
              className="
              flex
              items-center
              justify-center
              text-[22px]
              text-[#1f1b15]
              transition
              duration-300
              hover:text-[#7c5400]
              md:text-[23px]
              xl:text-[20px]
            "
            >
              <FiUser />
            </Link>
          </div>
        </div>
      </header>

      {/* MOBILE OVERLAY */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`
          fixed
          inset-0
          z-40
          bg-black/30
          transition-opacity
          duration-300
          lg:hidden
          ${mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
          }
        `}
      />

      {/* MOBILE MENU */}
      <div
        className={`
          fixed
          top-0
          left-0
          z-50
          h-screen
          w-[92%]
          max-w-[400px]
          bg-[#fff8f3]
          px-7
          py-8
          transition-transform
          duration-300
          lg:hidden
          ${mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
          }
        `}
      >
        {/* MOBILE HEADER */}
        <div className="mb-14 flex items-center justify-between">

          <div
            className="
            flex
            items-center
            justify-center
            rounded-full
            border
            border-[#eadcc8]
            bg-[#fff8f3]
            p-2
            shadow-[0_2px_12px_rgba(30,26,20,0.05)]
          "
          >
            <img
              src={logo}
              alt="Naarisa"
              className="
              h-12
              w-auto
              object-contain
            "
            />
          </div>

          <button
            onClick={() => setMobileMenuOpen(false)}
            className="
            flex
            items-center
            justify-center
            text-[30px]
            text-[#1f1b15]
          "
          >
            <FiX />
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <ul className="flex flex-col gap-10">
          {links.map((link, index) => (
            <li key={index}>
              {!link.dropdown ? (
                <NavLink
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `
                    group
                    relative
                    inline-block
                    font-['Jost']
                    text-[18px]
                    sm:text-[19px]
                    font-medium
                    tracking-[0.12em]
                    transition-all
                    duration-300
                    ${isActive
                      ? "text-[#7c5400]"
                      : "text-[#504537] hover:text-[#7c5400]"
                    }
                  `
                  }
                >
                  {({ isActive }) => (
                    <>
                      {link.title}

                      <span
                        className={`
                          absolute
                          left-0
                          -bottom-[6px]
                          h-[1px]
                          bg-[#7c5400]
                          transition-all
                          duration-300
                          ${isActive
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                          }
                        `}
                      />
                    </>
                  )}
                </NavLink>
              ) : (
                <div className="flex flex-col">

                  {/* CATEGORY BUTTON */}
                  <button
                    onClick={() =>
                      setMobileCategoryOpen(!mobileCategoryOpen)
                    }
                    className="
                    flex
                    items-center
                    justify-between
                    font-['Jost']
                    text-[18px]
                    sm:text-[19px]
                    font-normal
                    tracking-[0.12em]
                    text-[#1f1b15]
                  "
                  >
                    {link.title}

                    <span
                      className={`
                        text-[18px]
                        transition-transform
                        duration-300
                        ${mobileCategoryOpen
                          ? "rotate-45"
                          : ""
                        }
                      `}
                    >
                      +
                    </span>
                  </button>

                  {/* MOBILE DROPDOWN */}
                  <div
                    className={`
                      overflow-hidden
                      transition-all
                      duration-300
                      ${mobileCategoryOpen
                        ? "max-h-[640px] opacity-100"
                        : "max-h-0 opacity-0"
                      }
                    `}
                  >
                    <div className="ml-3 mt-5 flex flex-col gap-4">
                      {link.dropdown.map((item, idx) => (
                        <Link
                          key={idx}
                          to={item.path}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setMobileCategoryOpen(false);
                          }}
                          className="
                          font-['Jost']
                          text-[16px]
                          text-[#504537]
                          transition-all
                          duration-300
                          hover:text-[#7c5400]
                        "
                        >
                          {item.title}
                          {item.badge && <CategoryBadge text={item.badge} />}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => { setSearchOpen(false); setSearchQuery(""); setSuggestions([]); }}
          />
          <div className="fixed top-0 left-0 right-0 z-50 bg-[#fff8f3] shadow-lg px-5 py-5 sm:px-8">
            <div className="mx-auto max-w-[680px]">

              {/* Input row */}
              <div className="flex items-center gap-3 border-b border-[#e8ddd0] pb-4">
                <FiSearch className="text-[20px] text-[#7c5400] flex-shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && searchQuery.trim()) {
                      navigate(`/all-products?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchOpen(false); setSearchQuery(""); setSuggestions([]);
                    }
                    if (e.key === "Escape") { setSearchOpen(false); setSearchQuery(""); setSuggestions([]); }
                  }}
                  placeholder="Search for kurtis, dresses, sets…"
                  className="flex-1 bg-transparent font-['Jost'] text-[16px] text-[#1f1b15]
                       placeholder-[#a89080] outline-none"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(""); setSuggestions([]); }}
                  className="text-[22px] text-[#504537] hover:text-[#7c5400] transition"
                >
                  <FiX />
                </button>
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <ul className="mt-3 max-h-[60vh] overflow-y-auto divide-y divide-[#f0e8de]">
                  {suggestions.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          navigate(`/product/${item.slug || item.id}`);
                          setSearchOpen(false); setSearchQuery(""); setSuggestions([]);
                        }}
                        className="w-full flex items-center gap-4 py-3 text-left
                             hover:text-[#7c5400] transition-colors duration-200"
                      >
                        {item.image && (
                          <img src={ikImage(item.image, 120)} alt={item.name} loading="lazy" decoding="async"
                            className="h-12 w-12 rounded-lg object-cover flex-shrink-0
                                 border border-[#eadcc8]" />
                        )}
                        <div>
                          <p className="font-['Jost'] text-[14px] text-[#1f1b15] font-medium">
                            {item.name}
                          </p>
                          {item.category && (
                            <p className="font-['Jost'] text-[12px] text-[#a89080] mt-0.5">
                              {item.category}
                            </p>
                          )}
                        </div>
                        {item.price && (
                          <span className="ml-auto font-['Jost'] text-[13px] text-[#7c5400] font-medium">
                            ₹{item.price}
                          </span>
                        )}
                      </button>
                    </li>
                  ))}
                  <li>
                    {/* <button
                      onClick={() => {
                        navigate(`/all-products?search=${encodeURIComponent(searchQuery)}`);
                        setSearchOpen(false); setSearchQuery(""); setSuggestions([]);
                      }}
                      className="w-full py-3 font-['Jost'] text-[13px] text-[#7c5400]
                           font-medium tracking-wide hover:underline text-center"
                    >
                      See all results for "{searchQuery}" →
                    </button> */}
                  </li>
                </ul>
              )}

              {/* No results */}
              {searchQuery.trim() && suggestions.length === 0 && (
                <p className="mt-4 font-['Jost'] text-[13px] text-[#a89080] text-center">
                  No results found — press Enter to search all products
                </p>
              )}

              {/* Empty state hints */}
              {!searchQuery && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {(links.find((item) => item.title === "CATEGORIES")?.dropdown || [])
                    .map((tag) => (
                      <Link
                        key={tag.title}
                        to={tag.path}
                        className="rounded-full border border-[#e8ddd0] px-3 py-1.5 font-['Jost']
                   text-[12px] text-[#504537] transition-colors
                   hover:border-[#7c5400] hover:text-[#7c5400]"
                      >
                        {tag.title}
                      </Link>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;