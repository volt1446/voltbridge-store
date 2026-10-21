
import { Link } from "react-router-dom";
import { Wrench, MessageCircle, Phone, ShieldCheck } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/254726147462?text=" +
  encodeURIComponent(
    "Hello VoltBridge Technologies. I need help with a product or an after-sales enquiry."
  );

export default function ServiceCenter() {
  return (
    <main className="container policy-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Service Center</span>
      </nav>

      <header className="policy-header">
        <span className="eyebrow">PRODUCT SUPPORT</span>
        <h1>Service Center</h1>
        <p>
          Need assistance with a product purchased from
          VoltBridge Technologies? Contact us for guidance.
        </p>
      </header>

      <section className="policy-content">
        <div className="benefits-grid">
          <article>
            <Wrench size={28} />
            <h2>Product Assistance</h2>
            <p>
              Tell us about the product and the issue you are
              experiencing so we can advise on the next steps.
            </p>
          </article>

          <article>
            <ShieldCheck size={28} />
            <h2>Warranty Enquiries</h2>
            <p>
              Warranty coverage, duration, and available remedies
              depend on the product and its applicable terms.
              Contact us to discuss your specific purchase.
            </p>
          </article>

          <article>
            <MessageCircle size={28} />
            <h2>Contact Support</h2>
            <p>
              Send us your product name, purchase details, and
              a description of the issue.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary"
            >
              <MessageCircle size={17} />
              WhatsApp Support
            </a>
          </article>

          <article>
            <Phone size={28} />
            <h2>Speak to Us</h2>
            <p>
              Call us if you need help discussing your enquiry.
            </p>
            <a href="tel:+254726147462">
              +254 726 147 462
            </a>
          </article>
        </div>

        <h2>Before Contacting Us</h2>
        <ul>
          <li>Have your order or purchase details available.</li>
          <li>Identify the product and describe the issue clearly.</li>
          <li>
            Keep relevant accessories and proof of purchase where
            available.
          </li>
          <li>
            Wait for our instructions before sending or returning
            a product.
          </li>
        </ul>

        <p>
          <strong>Please note:</strong> This page provides a
          contact point for product assistance. It does not
          represent a promise that on-site repairs or a dedicated
          repair facility are available. We will discuss the
          available options for your particular enquiry.
        </p>

        <p>
          For questions about returns, please read our{" "}
          <Link to="/shipping-and-return-policy">
            Shipping and Return Policy
          </Link>.
        </p>
      </section>
    </main>
  );
}
