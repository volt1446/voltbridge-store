
import About from "./pages/About";
import Contact from "./pages/Contact";
import ExtendedWarranty from "./pages/ExtendedWarranty";
import FAQs from "./pages/FAQs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ServiceCenter from "./pages/ServiceCenter";
import ShippingReturns from "./pages/ShippingReturns";
import TermsAndConditions from "./pages/TermsAndConditions";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";

import {
  ShoppingCart,
  Search,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Package,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import { supabase } from "./supabase";
import { useCart } from "./CartContext";
import Admin from "./Admin";
import "./App.css";

const WHATSAPP_NUMBER = "254726147462";
const SITE_URL = "https://voltbridgetechnologies.com";

const HOME_TITLE =
  "Gaming Consoles, Samsung & Apple Chargers in Nairobi | VoltBridge";

const HOME_DESCRIPTION =
  "Shop gaming consoles, Samsung chargers and adapters, and Apple chargers and adapters at VoltBridge Technologies in Nairobi, Kenya. Retail and wholesale enquiries welcome.";

const CATEGORIES = [
  "All Products",
  "Gaming Consoles",
  "Samsung Chargers & Adapters",
  "Apple Chargers & Adapters",
];

/* ---------------- GENERAL HELPERS ---------------- */

function money(value) {
  return `KSh ${Number(value || 0).toLocaleString("en-KE", {
    maximumFractionDigits: 2,
  })}`;
}

function getProductPrice(product) {
  const regularPrice = Number(product?.price ?? 0);
  const salePrice = Number(
    product?.sale_price ?? product?.discount_price
  );

  if (
    Number.isFinite(salePrice) &&
    salePrice > 0 &&
    salePrice < regularPrice
  ) {
    return salePrice;
  }

  return regularPrice;
}

function getRegularPrice(product) {
  return Number(product?.price ?? 0);
}

function isProductOnSale(product) {
  return getProductPrice(product) < getRegularPrice(product);
}

function getProductStock(product) {
  const value = product?.stock_quantity ?? product?.stock;

  if (value === null || value === undefined || value === "") {
    return null;
  }

  const stock = Number(value);
  return Number.isFinite(stock) ? stock : null;
}

function getProductAvailability(product) {
  const stock = getProductStock(product);

  if (
    product?.is_active === false ||
    (stock !== null && stock <= 0)
  ) {
    return "Out of stock";
  }

  return "Available";
}

function isAvailable(product) {
  return (
    product?.is_active !== false &&
    getProductAvailability(product) === "Available"
  );
}

function getProductImage(product) {
  return (
    product?.image_url ||
    product?.image ||
    "/placeholder-product.png"
  );
}

function getAbsoluteImageUrl(product) {
  const image = getProductImage(product);

  if (!image || image === "/placeholder-product.png") {
    return null;
  }

  try {
    return new URL(image, `${SITE_URL}/`).href;
  } catch {
    return null;
  }
}

function makeWhatsAppUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;
}

/*
  These category checks support existing database category names
  such as "Gaming Devices", "Samsung Chargers", and "Apple Accessories".
*/

function getStoreCategory(product) {
  const category = String(product?.category || "").toLowerCase();
  const name = String(product?.name || "").toLowerCase();
  const description = String(product?.description || "").toLowerCase();

  const text = `${category} ${name} ${description}`;

  if (
    text.includes("gaming") ||
    text.includes("console") ||
    text.includes("handheld") ||
    text.includes("playstation") ||
    text.includes("xbox") ||
    text.includes("nintendo")
  ) {
    return "Gaming Consoles";
  }

  if (
    text.includes("samsung") &&
    (
      text.includes("charger") ||
      text.includes("adapter") ||
      text.includes("power") ||
      text.includes("cable") ||
      text.includes("usb-c")
    )
  ) {
    return "Samsung Chargers & Adapters";
  }

  if (
    (
      text.includes("apple") ||
      text.includes("iphone") ||
      text.includes("ipad") ||
      text.includes("macbook")
    ) &&
    (
      text.includes("charger") ||
      text.includes("adapter") ||
      text.includes("cable") ||
      text.includes("lightning") ||
      text.includes("usb-c") ||
      text.includes("power")
    )
  ) {
    return "Apple Chargers & Adapters";
  }

  return "Other";
}

/* ---------------- FEATURED HOMEPAGE PRODUCTS ---------------- */

function getFeaturedJ36(products) {
  return products.find((product) => {
    const name = String(product?.name || "").toLowerCase();

    return (
      name.includes("j36 ultra") ||
      name.includes("j36")
    );
  });
}

function getFeaturedSamsung(products) {
  return products.find((product) => {
    return (
      getStoreCategory(product) ===
      "Samsung Chargers & Adapters"
    );
  });
}

function getFeaturedApple(products) {
  return products.find((product) => {
    return (
      getStoreCategory(product) ===
      "Apple Chargers & Adapters"
    );
  });
}

function WhatsAppIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-label="WhatsApp"
      role="img"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M16.04 2.67A13.26 13.26 0 0 0 4.68 22.78L2.8 29.33l6.72-1.76a13.28 13.28 0 1 0 6.52-24.9Zm0 24.13a10.9 10.9 0 0 1-5.56-1.52l-.4-.24-3.99 1.04 1.06-3.88-.26-.4a10.88 10.88 0 1 1 9.15 5Zm5.98-8.16c-.33-.17-1.95-.96-2.25-1.07-.3-.11-.52-.17-.74.17-.22.33-.85 1.07-1.04 1.29-.19.22-.39.25-.72.08-.33-.17-1.39-.51-2.65-1.63-.98-.87-1.64-1.95-1.83-2.28-.19-.33-.02-.51.15-.68.15-.15.33-.39.5-.58.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.58-.08-.17-.74-1.79-1.01-2.45-.27-.64-.54-.55-.74-.56l-.63-.01c-.22 0-.58.08-.88.41-.3.33-1.15 1.12-1.15 2.73s1.18 3.17 1.34 3.39c.17.22 2.32 3.54 5.62 4.96.79.34 1.4.54 1.88.69.79.25 1.5.21 2.06.13.63-.09 1.95-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.39Z" />
    </svg>
  );
}

/* ---------------- SEO HELPERS ---------------- */

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(
    `meta[${attribute}="${key}"]`
  );

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function setCanonical(url) {
  let canonical = document.head.querySelector(
    'link[rel="canonical"]'
  );

  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }

  canonical.href = url;
}

function restoreHomeMetadata() {
  document.title = HOME_TITLE;

  setMeta("name", "description", HOME_DESCRIPTION);
  setMeta("name", "robots", "index, follow");

  setMeta("property", "og:type", "website");
  setMeta("property", "og:site_name", "VoltBridge Technologies");
  setMeta("property", "og:title", HOME_TITLE);
  setMeta("property", "og:description", HOME_DESCRIPTION);
  setMeta("property", "og:url", `${SITE_URL}/`);

  setMeta("name", "twitter:card", "summary");
  setMeta("name", "twitter:title", HOME_TITLE);
  setMeta("name", "twitter:description", HOME_DESCRIPTION);

  setCanonical(`${SITE_URL}/`);
}

function updateProductMetadata(product) {
  const url = `${SITE_URL}/product/${product.id}`;
  const name = String(product.name || "Product").trim();

  const title =
    `${name} in Nairobi, Kenya | VoltBridge Technologies`;

  const description = String(
    product.description ||
      `Shop ${name} at VoltBridge Technologies in Nairobi, Kenya.`
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 155);

  document.title = title;

  setMeta("name", "description", description);
  setMeta("name", "robots", "index, follow");

  setMeta("property", "og:type", "product");
  setMeta("property", "og:site_name", "VoltBridge Technologies");
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", url);

  const image = getAbsoluteImageUrl(product);

  if (image) {
    setMeta("property", "og:image", image);
    setMeta("name", "twitter:image", image);
  }

  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);

  setCanonical(url);
}

function removeProductStructuredData() {
  document.getElementById("product-jsonld")?.remove();
}

function updateProductStructuredData(product) {
  if (!product?.id || !product?.name) {
    removeProductStructuredData();
    return;
  }

  const url = `${SITE_URL}/product/${product.id}`;
  const image = getAbsoluteImageUrl(product);
  const price = getProductPrice(product);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description:
      product.description ||
      `Shop ${product.name} at VoltBridge Technologies in Nairobi.`,
    url,
    brand: {
      "@type": "Brand",
      name: "VoltBridge Technologies",
    },
    ...(image ? { image: [image] } : {}),
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "KES",
      price: price.toFixed(2),
      availability: isAvailable(product)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: {
        "@type": "Organization",
        name: "VoltBridge Technologies",
        url: SITE_URL,
      },
    },
  };

  let script = document.getElementById("product-jsonld");

  if (!script) {
    script = document.createElement("script");
    script.id = "product-jsonld";
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
}

/* ---------------- SHARED COMPONENTS ---------------- */

function Availability({ product }) {
  const available = isAvailable(product);

  return (
    <span
      className={`availability ${
        available ? "available" : "unavailable"
      }`}
    >
      {available ? "In Stock" : "Out of Stock"}
    </span>
  );
}

/* ---------------- HEADER ---------------- */

function Header() {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [headerCategory, setHeaderCategory] = useState("All Products");

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const closeMenu = () => setMenuOpen(false);

  const menuCategories = [
    "Gaming Consoles",
    "Samsung Chargers & Adapters",
    "Apple Chargers & Adapters",
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setHeaderSearch(params.get("search") || "");
    setHeaderCategory(
      params.get("category") || "All Products"
    );
  }, [location.search]);

  function handleHeaderSearch(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (headerSearch.trim()) {
      params.set("search", headerSearch.trim());
    }

    if (headerCategory !== "All Products") {
      params.set("category", headerCategory);
    }

    const query = params.toString();

    navigate(query ? `/?${query}#products` : "/#products");

    closeMenu();
  }

  function chooseMenuCategory(category) {
    const params = new URLSearchParams();

    params.set("category", category);

    navigate(`/?${params.toString()}#products`);

    closeMenu();
  }

  return (
    <header className="site-header vb-site-header">
      <div className="container vb-header-inner">

        <div className="vb-menu-wrapper">
          <button
            type="button"
            className="vb-hamburger"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={25} /> : <Menu size={25} />}
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                className="vb-menu-backdrop"
                aria-label="Close menu"
                onClick={closeMenu}
              />

              <nav className="vb-dropdown-menu">
                <div className="vb-menu-heading">
                  <strong>SHOP PRODUCTS</strong>
                </div>

                <button
                  type="button"
                  onClick={() => chooseMenuCategory("All Products")}
                >
                  All Products
                  <ChevronRight size={16} />
                </button>

                {menuCategories.map((item) => (
                  <button
                    type="button"
                    key={item}
                    onClick={() => chooseMenuCategory(item)}
                  >
                    {item}
                    <ChevronRight size={16} />
                  </button>
                ))}

                <div className="vb-menu-divider" />

                <div className="vb-menu-heading">
                  <strong>BUSINESS</strong>
                </div>

                <Link to="/about" onClick={closeMenu}>
                  About Us
                </Link>

                <Link to="/contact" onClick={closeMenu}>
                  Contact & Location
                </Link>

                <a
                  href={makeWhatsAppUrl(
                    "Hello VoltBridge Technologies. I am interested in wholesale products."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  Wholesale Enquiries
                </a>

                <div className="vb-menu-divider" />

                <div className="vb-menu-heading">
                  <strong>CUSTOMER SUPPORT</strong>
                </div>

                <Link to="/faqs" onClick={closeMenu}>
                  FAQs
                </Link>

                <Link to="/shipping-returns" onClick={closeMenu}>
                  Shipping & Returns
                </Link>

                <Link to="/privacy-policy" onClick={closeMenu}>
                  Privacy Policy
                </Link>

                <Link to="/terms-and-conditions" onClick={closeMenu}>
                  Terms & Conditions
                </Link>

                <Link to="/service-center" onClick={closeMenu}>
                  Service Center
                </Link>

                <Link to="/extended-warranty" onClick={closeMenu}>
                  Extended Warranty
                </Link>
              </nav>
            </>
          )}
        </div>

        <Link to="/" className="brand vb-header-brand">
          <span className="brand-icon">
            <Package size={25} />
          </span>

          <span className="brand-text">
            <strong>VoltBridge</strong>
            <small>TECHNOLOGIES</small>
          </span>
        </Link>

        <form
          className="vb-header-search"
          onSubmit={handleHeaderSearch}
        >
          <select
            aria-label="Search category"
            value={headerCategory}
            onChange={(event) =>
              setHeaderCategory(event.target.value)
            }
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <input
            type="search"
            placeholder="Search products..."
            aria-label="Search products"
            value={headerSearch}
            onChange={(event) =>
              setHeaderSearch(event.target.value)
            }
          />

          <button type="submit" aria-label="Search">
            <Search size={19} />
            <span>Search</span>
          </button>
        </form>

        <div className="vb-header-actions">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            className="vb-header-whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp"
            title="WhatsApp us"
          >
            <WhatsAppIcon size={21} />
            <span>WhatsApp</span>
          </a>

          <Link
            to="/cart"
            className="vb-header-cart"
            aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`}
            title="Shopping cart"
          >
            <ShoppingCart size={23} />
            <span className="vb-cart-label">Cart</span>

            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>

      <style>{`
        .vb-site-header {
          position: relative;
          z-index: 100;
          background: #fff;
          border-bottom: 1px solid #ededed;
        }

        .vb-header-inner {
          display: grid;
          grid-template-columns: auto auto minmax(220px, 1fr) auto;
          align-items: center;
          gap: 18px;
          min-height: 82px;
        }

        .vb-menu-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          flex-shrink: 0;
          z-index: 110;
        }

        .vb-hamburger {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border: 0;
          border-radius: 7px;
          background: transparent;
          cursor: pointer;
          color: #242424;
        }

        .vb-hamburger:hover {
          background: #fff5d5;
          color: #987000;
        }

        .vb-header-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          white-space: nowrap;
        }

        .vb-header-search {
          display: flex;
          align-items: stretch;
          width: 100%;
          min-width: 0;
          height: 46px;
          border: 1px solid #dedede;
          border-radius: 7px;
          overflow: hidden;
          background: #fff;
        }

        .vb-header-search select {
          flex: 0 0 175px;
          width: 175px;
          min-width: 0;
          padding: 0 10px;
          border: 0;
          border-right: 1px solid #e5e5e5;
          outline: none;
          background: #f8f8f8;
          color: #333;
          font-size: .83rem;
        }

        .vb-header-search input {
          flex: 1;
          min-width: 0;
          width: 100%;
          padding: 0 13px;
          border: 0;
          outline: none;
          background: #fff;
          color: #222;
          font-size: .92rem;
        }

        .vb-header-search button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          flex: 0 0 auto;
          padding: 0 17px;
          border: 0;
          background: #f5c542;
          color: #242424;
          font-weight: 800;
          cursor: pointer;
        }

        .vb-header-search button:hover {
          background: #e9b72b;
        }

        .vb-header-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 17px;
          white-space: nowrap;
        }

        .vb-header-whatsapp,
        .vb-header-cart {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #292929;
          text-decoration: none;
          font-size: .88rem;
          font-weight: 700;
        }

        .vb-header-whatsapp {
          color: #188d48;
        }

        .vb-header-cart:hover,
        .vb-header-whatsapp:hover {
          color: #a77b00;
        }

        .vb-header-cart .cart-count {
          position: absolute;
          top: -10px;
          right: -11px;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 18px;
          height: 18px;
          padding: 0 4px;
          border-radius: 20px;
          background: #f5c542;
          color: #222;
          font-size: 11px;
          font-weight: 800;
        }

        .vb-dropdown-menu {
          position: absolute;
          top: calc(100% + 17px);
          left: 0;
          width: min(310px, calc(100vw - 30px));
          max-height: 75vh;
          overflow-y: auto;
          background: #fff;
          color: #222;
          border-radius: 9px;
          box-shadow: 0 12px 35px rgba(0,0,0,.2);
          padding: 13px;
          z-index: 112;
        }

        .vb-dropdown-menu a,
        .vb-dropdown-menu button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          width: 100%;
          padding: 11px 10px;
          color: #292929;
          text-decoration: none;
          font-family: inherit;
          font-size: .94rem;
          text-align: left;
          border: 0;
          border-radius: 6px;
          background: transparent;
          cursor: pointer;
        }

        .vb-dropdown-menu a:hover,
        .vb-dropdown-menu button:hover {
          background: #fff7dc;
          color: #8a6500;
        }

        .vb-menu-heading {
          padding: 9px 10px 5px;
          color: #997300;
          font-size: .75rem;
          letter-spacing: .08em;
        }

        .vb-menu-divider {
          height: 1px;
          background: #eee;
          margin: 9px 4px;
        }

        .vb-menu-backdrop {
          position: fixed;
          inset: 0;
          z-index: 111;
          border: 0;
          background: rgba(0,0,0,.25);
          cursor: default;
        }

        @media (max-width: 900px) {
          .vb-header-inner {
            grid-template-columns: auto auto minmax(160px, 1fr) auto;
            gap: 10px;
          }

          .vb-header-search select {
            flex-basis: 135px;
            width: 135px;
            font-size: .76rem;
          }

          .vb-header-actions {
            gap: 11px;
          }

          .vb-header-whatsapp span,
          .vb-cart-label {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .vb-header-inner {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding-top: 10px;
            padding-bottom: 10px;
          }

          .vb-header-brand {
            margin-right: auto;
          }

          .vb-header-search {
            order: 5;
            flex: 1 0 100%;
            height: 43px;
          }

          .vb-header-search select {
            flex: 0 0 112px;
            width: 112px;
            padding: 0 5px;
            font-size: .7rem;
          }

          .vb-header-search input {
            padding: 0 8px;
            font-size: .82rem;
          }

          .vb-header-search button {
            padding: 0 11px;
          }

          .vb-header-search button span {
            display: none;
          }

          .vb-header-actions {
            gap: 13px;
          }

          .vb-header-whatsapp,
          .vb-header-cart {
            padding: 5px;
          }

          .vb-dropdown-menu {
            top: calc(100% + 12px);
          }
        }
      `}</style>
    </header>
  );
}

/* ---------------- FOOTER ---------------- */

function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="container footer-content">
        <div>
          <Link to="/" className="brand footer-brand">
            <span className="brand-icon">
              <Package size={24} />
            </span>

            <span className="brand-text">
              <strong>VoltBridge</strong>
              <small>TECHNOLOGIES</small>
            </span>
          </Link>

          <p>
            Your destination for gaming consoles, Samsung chargers
            and adapters, and Apple chargers and adapters.
          </p>
        </div>

        <div>
          <h3>Contact us</h3>
          <p>Bihi Tower, 4th Floor, Suite 6, Nairobi</p>

          <a
            href={makeWhatsAppUrl(
              "Hello VoltBridge Technologies. I need assistance."
            )}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={19} />
            Chat with us on WhatsApp
          </a>
        </div>

        <div>
          <h3>Shopping with us</h3>
          <p>Retail and wholesale enquiries welcome.</p>
          <p>Nairobi delivery and countrywide shipping.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          © {new Date().getFullYear()} VoltBridge Technologies.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
}

/* ---------------- PRODUCT CARD ---------------- */

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const available = isAvailable(product);
  const onSale = isProductOnSale(product);

  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-image-link"
      >
        <div className="product-image">
          <img
            src={getProductImage(product)}
            alt={product.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          {onSale && <span className="sale-badge">SALE</span>}
        </div>
      </Link>

      <div className="product-card-content">
        <span className="product-category">
          {product.category || "Products"}
        </span>

        <h3>
          <Link to={`/product/${product.id}`}>
            {product.name}
          </Link>
        </h3>

        <div className="product-price">
          <strong>{money(getProductPrice(product))}</strong>
          {onSale && <del>{money(getRegularPrice(product))}</del>}
        </div>

        <Availability product={product} />

        <button
          type="button"
          className="button button-primary add-to-cart-button"
          disabled={!available}
          onClick={() => addToCart(product)}
        >
          <ShoppingCart size={17} />
          {available ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </article>
  );
}

/* ---------------- HOMEPAGE ---------------- */

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Products");
  const [activeSlide, setActiveSlide] = useState(0);

  const orderPlaced = location.state?.orderPlaced;
  const orderNumber = location.state?.orderNumber;

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    setSearch(params.get("search") || "");
    setCategory(params.get("category") || "All Products");
  }, [location.search]);

  const j36Product = useMemo(
    () => getFeaturedJ36(products),
    [products]
  );

  const samsungProduct = useMemo(
    () => getFeaturedSamsung(products),
    [products]
  );

  const appleProduct = useMemo(
    () => getFeaturedApple(products),
    [products]
  );

  const heroSlides = useMemo(
    () => [
      {
        eyebrow: "J36 ULTRA HANDHELD CONSOLE",
        title: "Ready to play?",
        accent: "Gaming wherever you go.",
        description:
          "Discover the J36 Ultra handheld gaming console at VoltBridge Technologies.",
        image: getProductImage(j36Product),
        alt: "J36 Ultra handheld gaming console",
      },
      {
        eyebrow: "SAMSUNG CHARGERS & ADAPTERS",
        title: "Power up.",
        accent: "Samsung charging essentials.",
        description:
          "Explore Samsung chargers, power adapters and USB-C cables at VoltBridge Technologies.",
        image: getProductImage(samsungProduct),
        alt: "Samsung charger and power adapter from VoltBridge Technologies",
      },
      {
        eyebrow: "APPLE CHARGERS & ADAPTERS",
        title: "Stay connected.",
        accent: "Apple charging essentials.",
        description:
          "Shop Apple power adapters and charging cables at VoltBridge Technologies.",
        image: getProductImage(appleProduct),
        alt: "Apple charging adapter and cable from VoltBridge Technologies",
      },
    ],
    [j36Product, samsungProduct, appleProduct]
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % 3);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    removeProductStructuredData();
    restoreHomeMetadata();
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      if (!supabase) {
        throw new Error(
          "The store is not connected to Supabase. Check your environment variables."
        );
      }

      const { data, error: queryError } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (queryError) throw queryError;

      setProducts(data || []);
    } catch (err) {
      setError(
        err?.message || "Could not load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !term ||
        `${product.name || ""} ${product.category || ""} ${
          product.description || ""
        }`
          .toLowerCase()
          .includes(term);

      const productCategory = getStoreCategory(product);

      const matchesCategory =
        category === "All Products" ||
        productCategory === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const saleProducts = products.filter(
    (product) =>
      isProductOnSale(product) &&
      getStoreCategory(product) !== "Other"
  );

  function clearProductFilters() {
    setSearch("");
    setCategory("All Products");
    navigate("/#products");
  }

  return (
    <>
      {orderPlaced && (
        <section className="container page-state" role="status">
          <ShieldCheck size={35} />
          <h2>Order submitted successfully!</h2>

          {orderNumber && (
            <p>Your order reference is: {orderNumber}</p>
          )}

          <p>
            Your order is pending confirmation. Please follow the
            instructions provided by VoltBridge Technologies.
          </p>

          <button
            type="button"
            className="button button-primary"
            onClick={() =>
              navigate("/", { replace: true, state: null })
            }
          >
            Continue shopping
          </button>
        </section>
      )}

      <style>{`
        .vb-slider {
          position: relative;
          overflow: hidden;
          isolation: isolate;
          min-height: 500px;
          background: #171717;
          color: #fff;
        }

        .vb-slide-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          background-size: cover;
          background-position: center;
          transition: background-image .4s ease;
        }

        .vb-slider::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          background: linear-gradient(
            90deg,
            rgba(13,13,13,.88) 0%,
            rgba(13,13,13,.68) 46%,
            rgba(13,13,13,.18) 100%
          );
        }

        .vb-slide-inner {
          min-height: 500px;
          display: flex;
          align-items: center;
          padding-top: 54px;
          padding-bottom: 72px;
        }

        .vb-slide-copy {
          max-width: 650px;
        }

        .vb-slide-copy h1 {
          color: #fff;
          font-size: clamp(2.4rem, 5vw, 4.5rem);
          line-height: 1.04;
          letter-spacing: -.04em;
          margin: 16px 0;
        }

        .vb-slide-copy h1 span {
          display: block;
          color: #f5c542;
        }

        .vb-slide-copy p {
          max-width: 540px;
          color: rgba(255,255,255,.9);
          font-size: 1.08rem;
          line-height: 1.7;
        }

        .vb-slide-eyebrow {
          color: #f5c542;
          font-weight: 800;
          letter-spacing: .13em;
          font-size: .78rem;
        }

        .vb-slide-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 26px;
        }

        .vb-slider-control {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255,255,255,.55);
          border-radius: 50%;
          color: #fff;
          background: rgba(0,0,0,.35);
          cursor: pointer;
          z-index: 2;
        }

        .vb-slider-prev { left: 18px; }
        .vb-slider-next { right: 18px; }

        .vb-slider-dots {
          position: absolute;
          bottom: 22px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          gap: 9px;
          z-index: 2;
        }

        .vb-slider-dot {
          width: 9px;
          height: 9px;
          padding: 0;
          border: 0;
          border-radius: 50%;
          background: rgba(255,255,255,.55);
          cursor: pointer;
        }

        .vb-slider-dot.active {
          width: 26px;
          border-radius: 10px;
          background: #f5c542;
        }

        .vb-float-contact {
          position: fixed;
          right: 18px;
          bottom: 18px;
          z-index: 50;
        }

        .vb-float-contact a {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 999px;
          padding: 12px 16px;
          box-shadow: 0 5px 20px rgba(0,0,0,.18);
          text-decoration: none;
          font-weight: 800;
        }

        .vb-float-wa {
          background: #25D366;
          color: #063d1d;
        }

        .vb-search-row {
          display: flex;
          gap: 14px;
          align-items: center;
          flex-wrap: wrap;
          margin: 25px 0;
        }

        .vb-search-box {
          flex: 1 1 280px;
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 15px;
          border: 1px solid #ddd;
          border-radius: 9px;
          background: #fff;
        }

        .vb-search-box input {
          flex: 1;
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          font: inherit;
        }

        .vb-category-select {
          flex: 0 1 260px;
          min-height: 48px;
          padding: 0 12px;
          border: 1px solid #ddd;
          border-radius: 9px;
          background: #fff;
          font: inherit;
        }

        @media (max-width: 640px) {
          .vb-slider,
          .vb-slide-inner {
            min-height: 480px;
          }

          .vb-slide-inner {
            padding: 48px 24px 78px;
          }

          .vb-slide-copy h1 {
            font-size: 2.45rem;
          }

          .vb-slider-prev { left: 8px; }
          .vb-slider-next { right: 8px; }

          .vb-slider-control {
            width: 34px;
            height: 34px;
          }

          .vb-float-contact {
            right: 10px;
            bottom: 10px;
          }

          .vb-float-contact a {
            padding: 11px 13px;
            font-size: .86rem;
          }

          .vb-search-row {
            align-items: stretch;
          }

          .vb-category-select {
            flex-basis: 100%;
          }
        }
      `}</style>

      <section className="vb-slider" aria-label="Featured products">
        <div
          className="vb-slide-bg"
          style={{
            backgroundImage: `url("${heroSlides[activeSlide].image}")`,
          }}
          role="img"
          aria-label={heroSlides[activeSlide].alt}
        />

        <button
          type="button"
          className="vb-slider-control vb-slider-prev"
          aria-label="Previous banner"
          onClick={() =>
            setActiveSlide(
              (current) =>
                (current - 1 + heroSlides.length) % heroSlides.length
            )
          }
        >
          <ChevronRight
            size={22}
            style={{ transform: "rotate(180deg)" }}
          />
        </button>

        <div className="container vb-slide-inner">
          <div className="vb-slide-copy">
            <span className="vb-slide-eyebrow">
              {heroSlides[activeSlide].eyebrow}
            </span>

            <h1>
              {heroSlides[activeSlide].title}
              <span>{heroSlides[activeSlide].accent}</span>
            </h1>

            <p>{heroSlides[activeSlide].description}</p>

            {/* ONLY SHOP NOW BUTTON REMAINS IN THE SLIDER */}

            <div className="vb-slide-actions">
              <a href="#products" className="button button-primary">
                Shop now <ArrowRight size={18} />
              </a>
            </div>

            <div className="hero-trust">
              <span>
                <ShieldCheck size={18} /> Retail & wholesale
              </span>
              <span>
                <Truck size={18} /> Delivery available
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="vb-slider-control vb-slider-next"
          aria-label="Next banner"
          onClick={() =>
            setActiveSlide(
              (current) => (current + 1) % heroSlides.length
            )
          }
        >
          <ChevronRight size={22} />
        </button>

        <div className="vb-slider-dots" aria-label="Choose banner">
          {heroSlides.map((slide, index) => (
            <button
              key={slide.eyebrow}
              type="button"
              aria-label={`Show banner ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              className={`vb-slider-dot ${
                activeSlide === index ? "active" : ""
              }`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>
      </section>

      <div className="vb-float-contact" aria-label="Contact VoltBridge">
        <a
          className="vb-float-wa"
          href={makeWhatsAppUrl(
            "Hello VoltBridge Technologies. I would like to enquire about your products."
          )}
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with VoltBridge on WhatsApp"
        >
          <WhatsAppIcon size={21} />
          WhatsApp
        </a>
      </div>

      {/* BENEFITS SECTION REMOVED */}

      {saleProducts.length > 0 && (
        <section className="container sale-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SPECIAL OFFERS</span>
              <h2>Products on sale</h2>
            </div>
          </div>

          <div className="product-grid">
            {saleProducts.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      <section className="container products-section" id="products">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EXPLORE OUR STORE</span>
            <h2>Shop our products</h2>
            <p>
              Gaming consoles, Samsung chargers and adapters,
              and Apple chargers and adapters.
            </p>
          </div>
        </div>

        <div className="vb-search-row">
          <label className="vb-search-box">
            <Search size={20} />
            <input
              type="search"
              placeholder="Search gaming consoles, Samsung or Apple products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <select
            className="vb-category-select"
            aria-label="Filter products by category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="page-state">
            <RefreshCw className="spin" size={28} />
            <p>Loading products...</p>
          </div>
        ) : error ? (
          <div className="page-state error-state">
            <p>{error}</p>
            <button
              type="button"
              className="button button-primary"
              onClick={loadProducts}
            >
              Try again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="page-state">
            <Package size={32} />
            <h3>No products found</h3>
            <p>
              Try another search or choose a different product category.
            </p>
            <button
              type="button"
              className="button button-secondary"
              onClick={clearProductFilters}
            >
              Clear search and filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

/* ---------------- PRODUCT DETAILS ---------------- */

function ProductDetailPage() {
  const { productId } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProduct() {
      setLoading(true);
      setError("");
      setProduct(null);

      try {
        if (!supabase) {
          throw new Error("Supabase is not configured.");
        }

        const { data, error: queryError } = await supabase
          .from("products")
          .select("*")
          .eq("id", productId)
          .maybeSingle();

        if (queryError) throw queryError;

        if (!data || data.is_active === false) {
          throw new Error("This product is not currently available.");
        }

        if (!cancelled) setProduct(data);
      } catch (err) {
        if (!cancelled) {
          setError(err?.message || "Could not load this product.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProduct();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  useEffect(() => {
    if (!product) return undefined;

    updateProductMetadata(product);
    updateProductStructuredData(product);

    return () => {
      removeProductStructuredData();
      restoreHomeMetadata();
    };
  }, [product]);

  if (loading) {
    return (
      <div className="container page-state">
        <RefreshCw className="spin" size={28} />
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container page-state">
        <h2>Product unavailable</h2>
        <p>{error || "This product could not be found."}</p>
        <Link to="/" className="button button-primary">
          Return to shop
        </Link>
      </div>
    );
  }

  const available = isAvailable(product);
  const onSale = isProductOnSale(product);

  return (
    <section className="container product-detail-section">
      <div className="breadcrumbs">
        <Link to="/">Home</Link>
        <ChevronRight size={15} />
        <span>{product.name}</span>
      </div>

      <div className="product-detail">
        <div className="product-detail-image">
          <img
            src={getProductImage(product)}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
          {onSale && <span className="sale-badge">SALE</span>}
        </div>

        <div className="product-detail-info">
          <span className="product-category">
            {product.category || "Products"}
          </span>

          <h1>{product.name}</h1>

          <div className="product-price detail-price">
            <strong>{money(getProductPrice(product))}</strong>
            {onSale && <del>{money(getRegularPrice(product))}</del>}
          </div>

          <Availability product={product} />

          <p className="product-description">
            {product.description ||
              "Contact us for more information about this product."}
          </p>

          <button
            type="button"
            className="button button-primary"
            disabled={!available}
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={18} />
            {available ? "Add to cart" : "Out of stock"}
          </button>

          <a
            className="button button-secondary"
            href={makeWhatsAppUrl(
              `Hello VoltBridge Technologies. I would like to enquire about ${product.name}.`
            )}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={20} />
            Ask on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

/* ---------------- CART ---------------- */

function CartPage() {
  const {
    cartItems,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    cartTotal,
  } = useCart();

  const navigate = useNavigate();

  return (
    <section className="container cart-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR SHOPPING</span>
          <h1>Your cart</h1>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="page-state">
          <ShoppingCart size={35} />
          <h2>Your cart is empty</h2>
          <p>Explore our store and add products to your cart.</p>
          <Link to="/" className="button button-primary">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => {
              const available = isAvailable(item);
              const stock = getProductStock(item);
              const quantityLimit = stock === null ? Infinity : stock;

              return (
                <article className="cart-item" key={item.id}>
                  <img
                    src={getProductImage(item)}
                    alt={item.name}
                    className="cart-item-image"
                  />

                  <div className="cart-item-details">
                    <Link to={`/product/${item.id}`}>
                      <h3>{item.name}</h3>
                    </Link>

                    <strong>{money(getProductPrice(item))}</strong>
                    <Availability product={item} />

                    <div className="quantity-control">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => decreaseQuantity(item.id)}
                      >
                        <Minus size={15} />
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={
                          !available || item.quantity >= quantityLimit
                        }
                        onClick={() => increaseQuantity(item.id)}
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <button
                      type="button"
                      className="remove-item"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>

                  <strong className="cart-line-total">
                    {money(getProductPrice(item) * item.quantity)}
                  </strong>
                </article>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h2>Order summary</h2>

            <div className="summary-row">
              <span>Subtotal</span>
              <strong>{money(cartTotal)}</strong>
            </div>

            <p className="summary-note">
              Delivery costs can be confirmed when your order is arranged.
            </p>

            <button
              type="button"
              className="button button-primary full-width"
              disabled={cartItems.some((item) => !isAvailable(item))}
              onClick={() => navigate("/checkout")}
            >
              Proceed to checkout <ArrowRight size={17} />
            </button>

            <Link to="/" className="continue-shopping">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

/* ---------------- CHECKOUT ---------------- */

function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
    paymentMethod: "M-Pesa",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    if (cartItems.some((item) => !isAvailable(item))) {
      setError(
        "One or more products are unavailable. Please update your cart."
      );
      return;
    }

    if (!supabase) {
      setError("The store is not connected to Supabase.");
      return;
    }

    setSubmitting(true);

    try {
      const orderItems = cartItems.map((item) => ({
        product_id: item.id,
        product_name: item.name,
        quantity: Number(item.quantity),
        unit_price: getProductPrice(item),
      }));

      const { data, error: orderError } = await supabase.rpc(
        "place_store_order",
        {
          p_customer_name: form.customerName.trim(),
          p_phone: form.phone.trim(),
          p_email: form.email.trim() || null,
          p_delivery_address: form.address.trim(),
          p_notes: form.notes.trim() || null,
          p_payment_method: form.paymentMethod,
          p_items: orderItems,
        }
      );

      if (orderError) throw orderError;

      const orderNumber =
        typeof data === "string"
          ? data
          : data?.order_number || data?.order_id || "";

      const message = [
        "Hello VoltBridge Technologies!",
        "",
        "I have placed an order through the website.",
        orderNumber ? `Order reference: ${orderNumber}` : "",
        `Name: ${form.customerName.trim()}`,
        `Phone: ${form.phone.trim()}`,
        `Delivery address: ${form.address.trim()}`,
        `Payment method: ${form.paymentMethod}`,
        "",
        "Items:",
        ...cartItems.map(
          (item) =>
            `- ${item.name} x ${item.quantity} — ${money(
              getProductPrice(item) * item.quantity
            )}`
        ),
        "",
        `Order subtotal: ${money(Number(data?.subtotal ?? cartTotal))}`,
        form.notes.trim() ? `Notes: ${form.notes.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      clearCart();

      window.open(
        makeWhatsAppUrl(message),
        "_blank",
        "noopener,noreferrer"
      );

      navigate("/", {
        replace: true,
        state: {
          orderPlaced: true,
          orderNumber,
        },
      });
    } catch (err) {
      setError(
        err?.message ||
          "Your order could not be submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!cartItems.length) {
    return (
      <section className="container page-state">
        <ShoppingCart size={35} />
        <h2>Your cart is empty</h2>
        <Link to="/" className="button button-primary">
          Return to shop
        </Link>
      </section>
    );
  }

  return (
    <section className="container checkout-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">ALMOST THERE</span>
          <h1>Checkout</h1>
          <p>Enter your contact and delivery details.</p>
        </div>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <h2>Customer information</h2>

          <label>
            Full name *
            <input
              type="text"
              value={form.customerName}
              onChange={(event) =>
                update("customerName", event.target.value)
              }
              required
              maxLength={160}
            />
          </label>

          <label>
            Phone number *
            <input
              type="tel"
              value={form.phone}
              onChange={(event) => update("phone", event.target.value)}
              required
              maxLength={30}
            />
          </label>

          <label>
            Email address
            <input
              type="email"
              value={form.email}
              onChange={(event) => update("email", event.target.value)}
            />
          </label>

          <label>
            Delivery address *
            <textarea
              rows={3}
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
              required
              maxLength={1000}
            />
          </label>

          <label>
            Payment method *
            <select
              value={form.paymentMethod}
              onChange={(event) =>
                update("paymentMethod", event.target.value)
              }
              required
            >
              <option value="M-Pesa">M-Pesa</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>
          </label>

          <label>
            Additional notes
            <textarea
              rows={3}
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              maxLength={1000}
              placeholder="Optional delivery instructions"
            />
          </label>

          {error && (
            <p className="form-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="button button-primary full-width"
            disabled={
              submitting || cartItems.some((item) => !isAvailable(item))
            }
          >
            {submitting ? "Placing order..." : "Place order"}
            {!submitting && <ArrowRight size={17} />}
          </button>

          <p className="checkout-whatsapp-note">
            After your order is submitted, WhatsApp will open so you can
            communicate with VoltBridge Technologies about the order.
          </p>
        </form>

        <aside className="checkout-summary">
          <h2>Your order</h2>

          {cartItems.map((item) => (
            <div className="checkout-item" key={item.id}>
              <img src={getProductImage(item)} alt={item.name} />

              <div>
                <strong>{item.name}</strong>
                <small>Quantity: {item.quantity}</small>
                <Availability product={item} />
              </div>

              <strong>
                {money(getProductPrice(item) * item.quantity)}
              </strong>
            </div>
          ))}

          <div className="summary-row">
            <span>Subtotal</span>
            <strong>{money(cartTotal)}</strong>
          </div>

          <p className="summary-note">
            Delivery fees, where applicable, will be confirmed with you.
          </p>
        </aside>
      </div>
    </section>
  );
}

/* ---------------- PAGE LAYOUT ---------------- */

function StandardPage({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

/* ---------------- ROUTES ---------------- */

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Admin />} />

      <Route
        path="/"
        element={
          <StandardPage>
            <HomePage />
          </StandardPage>
        }
      />

      <Route
        path="/product/:productId"
        element={
          <StandardPage>
            <ProductDetailPage />
          </StandardPage>
        }
      />

      <Route
        path="/cart"
        element={
          <StandardPage>
            <CartPage />
          </StandardPage>
        }
      />

      <Route
        path="/checkout"
        element={
          <StandardPage>
            <CheckoutPage />
          </StandardPage>
        }
      />

      <Route
        path="/about"
        element={
          <StandardPage>
            <About />
          </StandardPage>
        }
      />

      <Route
        path="/contact"
        element={
          <StandardPage>
            <Contact />
          </StandardPage>
        }
      />

      <Route
        path="/faqs"
        element={
          <StandardPage>
            <FAQs />
          </StandardPage>
        }
      />

      <Route
        path="/shipping-returns"
        element={
          <StandardPage>
            <ShippingReturns />
          </StandardPage>
        }
      />

      <Route
        path="/privacy-policy"
        element={
          <StandardPage>
            <PrivacyPolicy />
          </StandardPage>
        }
      />

      <Route
        path="/terms-and-conditions"
        element={
          <StandardPage>
            <TermsAndConditions />
          </StandardPage>
        }
      />

      <Route
        path="/service-center"
        element={
          <StandardPage>
            <ServiceCenter />
          </StandardPage>
        }
      />

      <Route
        path="/extended-warranty"
        element={
          <StandardPage>
            <ExtendedWarranty />
          </StandardPage>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  // BrowserRouter is already provided by main.jsx.
  return <AppRoutes />;
}
