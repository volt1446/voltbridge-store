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
  PhoneCall,
  RefreshCw,
  ChevronRight,
} from "lucide-react";

import { supabase } from "./supabase";
import { useCart } from "./CartContext";
import Admin from "./Admin";
import "./App.css";

const WHATSAPP_NUMBER = "254726147462";
const PHONE_NUMBER = "+254726147462";
const SITE_URL = "https://voltbridgetechnologies.com";

const HOME_TITLE =
  "Phone Accessories in Nairobi, Kenya | VoltBridge Technologies";

const HOME_DESCRIPTION =
  "Shop phone accessories in Nairobi, Kenya, at VoltBridge Technologies. Explore chargers, cables, phone cases, power banks, earbuds and more. Retail and wholesale enquiries welcome.";

const CATEGORIES = [
  "All",
  "Phone Cases",
  "Chargers & Cables",
  "Power Banks",
  "Earbuds & Headphones",
  "Screen Protectors",
  "Phone Holders",
  "Other Accessories",
];

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
  const name = String(product.name || "Phone Accessory").trim();

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


function Header() {
  const { cartItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={closeMenu}>
          <span className="brand-icon">
            <Package size={25} />
          </span>

          <span className="brand-text">
            <strong>VoltBridge</strong>
            <small>TECHNOLOGIES</small>
          </span>
        </Link>

        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>

          <a href="/#products" onClick={closeMenu}>
            Shop
          </a>

          <a href="/#about" onClick={closeMenu}>
            About
          </a>

          <a href="/#contact" onClick={closeMenu}>
            Contact
          </a>
        </nav>

        <div className="header-actions">
          <Link
            to="/cart"
            className="header-icon-link"
            aria-label={`Shopping cart${cartCount ? `, ${cartCount} items` : ""}`}
            title="Shopping cart"
            onClick={closeMenu}
          >
            <ShoppingCart size={21} />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </Link>

          <a
            href="https://wa.me/254726147462"
            className="header-icon-link whatsapp-header-link"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with VoltBridge on WhatsApp"
            title="WhatsApp us"
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.85 11.85 0 0 0 12.08 0C5.5 0 .15 5.35.15 11.93c0 2.1.55 4.16 1.6 5.97L.05 24l6.25-1.64a11.94 11.94 0 0 0 5.78 1.47h.01c6.58 0 11.93-5.35 11.93-11.93 0-3.19-1.24-6.19-3.5-8.42ZM12.09 21.8a9.9 9.9 0 0 1-5.04-1.38l-.36-.21-3.71.97.99-3.62-.24-.37a9.84 9.84 0 0 1-1.51-5.26c0-5.45 4.44-9.89 9.89-9.89 2.64 0 5.12 1.03 6.98 2.89a9.82 9.82 0 0 1 2.9 7c0 5.44-4.44 9.87-9.9 9.87Zm5.43-7.4c-.3-.15-1.77-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.96 1.17-.18.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.68-1.63-.93-2.23-.24-.58-.49-.5-.68-.51l-.58-.01c-.2 0-.53.07-.81.38-.28.3-1.06 1.03-1.06 2.5s1.09 2.9 1.24 3.1c.15.2 2.14 3.27 5.19 4.59.72.31 1.28.5 1.72.64.72.23 1.38.2 1.9.12.58-.09 1.77-.73 2.02-1.43.25-.7.25-1.3.17-1.43-.08-.13-.28-.2-.58-.35Z" />
            </svg>
          </a>

          <a
            href="tel:+254726147462"
            className="header-icon-link"
            aria-label="Call VoltBridge"
            title="Call us"
          >
            <svg
              viewBox="0 0 24 24"
              width="21"
              height="21"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.79a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.89.34 1.83.58 2.79.7A2 2 0 0 1 22 16.92Z" />
            </svg>
          </a>

          <button
            type="button"
            className="mobile-menu-button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>
    </header>
  );
}


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
            Your destination for phone accessories and everyday
            technology essentials.
          </p>
        </div>

        <div>
          <h3>Contact us</h3>
          <p>Bihi Tower, 4th Floor, Suite 5, Nairobi</p>

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

          <a href={`tel:${PHONE_NUMBER}`} className="vb-footer-call">
            <PhoneCall size={17} />
            Call us: {PHONE_NUMBER}
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
          {product.category || "Accessories"}
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
  const [category, setCategory] = useState("All");
  const [activeSlide, setActiveSlide] = useState(0);

  const orderPlaced = location.state?.orderPlaced;
  const orderNumber = location.state?.orderNumber;

  const heroSlides = [
    {
      eyebrow: "VOLTBRIDGE TECHNOLOGIES",
      title: "Power your world.",
      accent: "Choose the right accessories.",
      description:
        "Shop quality chargers, cables and everyday tech essentials in Nairobi.",
      image:
        "https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&w=1800&q=85",
      alt: "Smartphone and technology accessories",
    },
    {
      eyebrow: "SAMSUNG & APPLE ACCESSORIES",
      title: "Charge smarter.",
      accent: "Stay connected.",
      description:
        "Explore charging adapters and cables for your everyday devices.",
      image:
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1800&q=85",
      alt: "Consumer technology accessories",
    },
    {
      eyebrow: "RETAIL & WHOLESALE",
      title: "Your tech essentials,",
      accent: "all in one place.",
      description:
        "Browse our products and contact us for availability, delivery and wholesale enquiries.",
      image:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1800&q=85",
      alt: "Smartphone product display",
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
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

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const saleProducts = products.filter(isProductOnSale);

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

        .vb-call-button,
        .vb-whatsapp-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 18px;
          border-radius: 9px;
          font-weight: 800;
          text-decoration: none;
        }

        .vb-call-button {
          border: 1px solid rgba(255,255,255,.7);
          color: #fff;
          background: rgba(255,255,255,.1);
        }

        .vb-whatsapp-button {
          background: #25D366;
          color: #063d1d;
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
          display: flex;
          flex-direction: column;
          gap: 10px;
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

        .vb-float-call {
          background: #f5c542;
          color: #222;
        }

        .vb-footer-call {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 12px;
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

            <div className="vb-slide-actions">
              <a href="#products" className="button button-primary">
                Shop now <ArrowRight size={18} />
              </a>

              <a
                href={makeWhatsAppUrl(
                  "Hello VoltBridge Technologies. I would like to enquire about your products."
                )}
                target="_blank"
                rel="noreferrer"
                className="vb-whatsapp-button"
              >
                <WhatsAppIcon size={20} />
                WhatsApp us
              </a>

              <a
                href={`tel:${PHONE_NUMBER}`}
                className="vb-call-button"
              >
                <PhoneCall size={18} />
                Call us
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

        <a
          className="vb-float-call"
          href={`tel:${PHONE_NUMBER}`}
          aria-label="Call VoltBridge Technologies"
        >
          <PhoneCall size={19} />
          Call us
        </a>
      </div>

      <section className="benefits-section" id="about">
        <div className="container benefits-grid">
          <article>
            <ShieldCheck size={26} />
            <div>
              <h3>Quality accessories</h3>
              <p>Products selected for everyday use.</p>
            </div>
          </article>

          <article>
            <Truck size={26} />
            <div>
              <h3>Delivery available</h3>
              <p>Nairobi delivery and countrywide shipping.</p>
            </div>
          </article>

          <article>
            <WhatsAppIcon size={26} />
            <div>
              <h3>Easy enquiries</h3>
              <p>Contact us directly through WhatsApp.</p>
            </div>
          </article>

          <article>
            <RefreshCw size={26} />
            <div>
              <h3>Availability updates</h3>
              <p>Check whether a product is available before ordering.</p>
            </div>
          </article>
        </div>
      </section>

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
            <p>Find accessories for your everyday technology needs.</p>
          </div>
        </div>

        <div className="product-toolbar">
          <label className="product-search">
            <Search size={19} />
            <input
              type="search"
              placeholder="Search products..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <label className="category-filter">
            <span>Category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
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
            <p>Try a different search or category.</p>
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
            {product.category || "Accessories"}
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

/* ---------------- ROUTES ---------------- */

function AppRoutes() {
  return (
    <Routes>
      <Route path="/admin/*" element={<Admin />} />

      <Route
        path="/"
        element={
          <>
            <Header />
            <HomePage />
            <Footer />
          </>
        }
      />

      <Route
        path="/product/:productId"
        element={
          <>
            <Header />
            <ProductDetailPage />
            <Footer />
          </>
        }
      />

      <Route
        path="/cart"
        element={
          <>
            <Header />
            <CartPage />
            <Footer />
          </>
        }
      />

      <Route
        path="/checkout"
        element={
          <>
            <Header />
            <CheckoutPage />
            <Footer />
          </>
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