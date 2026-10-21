
import { Link } from "react-router-dom";
import { ShieldCheck, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/254726147462?text=" +
  encodeURIComponent(
    "Hello VoltBridge Technologies. I would like to enquire about warranty coverage for a product."
  );

export default function ExtendedWarranty() {
  return (
    <main className="container policy-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Extended Warranty</span>
      </nav>

      <header className="policy-header">
        <span className="eyebrow">PRODUCT PROTECTION</span>
        <h1>Extended Warranty</h1>
        <p>
          Have questions about warranty coverage for a product?
          Contact our team for clarification before purchasing.
        </p>
      </header>

      <section className="policy-content">
        <div className="benefits-grid">
          <article>
            <ShieldCheck size={28} />
            <h2>Check Product Coverage</h2>
            <p>
              Warranty terms may differ depending on the product,
              manufacturer, supplier, and purchase conditions.
              Please ask us to confirm the terms for your item.
            </p>
          </article>

          <article>
            <MessageCircle size={28} />
            <h2>Ask Our Team</h2>
            <p>
              Send us the product name and any warranty information
              supplied with it so we can assist with your enquiry.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary"
            >
              <MessageCircle size={17} />
              Enquire on WhatsApp
            </a>
          </article>
        </div>

        <h2>What You Should Confirm</h2>
        <ul>
          <li>Whether the specific product includes a warranty.</li>
          <li>The warranty duration and when it begins.</li>
          <li>What defects or faults may be covered.</li>
          <li>Any exclusions and the process for making a claim.</li>
          <li>
            Whether an additional extended-warranty option is
            actually available for that product.
          </li>
        </ul>

        <h2>Is Extended Warranty Available?</h2>
        <p>
          Please contact us to confirm whether an extended-warranty
          plan is available for your chosen product. Availability,
          cost, duration, and terms must be confirmed before
          purchase.
        </p>
        <p>
          This page does not itself create a warranty or guarantee
          that an extended-warranty plan is available. Any warranty
          offered will be subject to its applicable terms and
          your rights under Kenyan law.
        </p>

        <h2>Need Help With an Existing Purchase?</h2>
        <p>
          Keep your proof of purchase and any warranty documentation
          available when contacting us.
        </p>
        <p>
          You can also visit our{" "}
          <Link to="/service-center">Service Center page</Link>{" "}
          for product-support information.
        </p>
      </section>
    </main>
  );
}
