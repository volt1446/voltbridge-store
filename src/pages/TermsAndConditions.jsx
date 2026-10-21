
import { Link } from "react-router-dom";

export default function TermsAndConditions() {
  return (
    <main className="container policy-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Terms and Conditions</span>
      </nav>

      <header className="policy-header">
        <span className="eyebrow">PLEASE READ</span>
        <h1>Terms and Conditions</h1>
        <p>
          These terms explain the general conditions for using
          the VoltBridge Technologies website and enquiring about
          or purchasing our products.
        </p>
        <p><small>Last updated: 21 October 2026</small></p>
      </header>

      <section className="policy-content">
        <h2>1. About These Terms</h2>
        <p>
          This website is operated by VoltBridge Technologies,
          based at Bihi Tower, 4th Floor, Suite 5, Nairobi, Kenya.
          By using the website, you agree to these terms, subject
          to applicable law.
        </p>

        <h2>2. Product Information</h2>
        <p>
          We aim to display accurate product descriptions, images,
          prices, and availability. However, product images,
          packaging, specifications, and manufacturer details may
          occasionally differ. Please contact us if you need to
          confirm a specific feature before ordering.
        </p>

        <h2>3. Prices and Availability</h2>
        <p>
          Prices and stock availability are subject to confirmation.
          A product displayed on the website may become unavailable
          before an order is confirmed. Any applicable delivery
          charges and other costs will be communicated during the
          ordering process.
        </p>

        <h2>4. Orders and Confirmation</h2>
        <p>
          Customers may enquire or place orders through the ordering
          options provided on the website, including WhatsApp where
          available. An enquiry or cart submission is not necessarily
          confirmation that an order has been accepted.
        </p>
        <p>
          Before an order is finalised, the relevant product,
          quantity, price, delivery arrangements, and payment
          method should be confirmed with us.
        </p>

        <h2>5. Payments and Delivery</h2>
        <p>
          Available payment methods, delivery fees, delivery
          locations, and estimated delivery times will be confirmed
          when arranging an order. Delivery estimates may change
          because of circumstances outside our reasonable control.
        </p>

        <h2>6. Returns, Refunds, and Exchanges</h2>
        <p>
          Returns, refunds, and exchanges are handled according to
          our{" "}
          <Link to="/shipping-and-return-policy">
            Shipping and Return Policy
          </Link>
          , the terms applicable to the purchase, and relevant
          Kenyan consumer-protection law.
        </p>
        <p>
          Nothing in these terms is intended to exclude or limit
          rights that cannot lawfully be excluded or limited.
        </p>

        <h2>7. Warranty and Product Support</h2>
        <p>
          Warranty coverage varies by product and its applicable
          terms. Please confirm warranty details before purchase
          if they are important to your decision.
        </p>
        <p>
          Visit our{" "}
          <Link to="/extended-warranty">Extended Warranty page</Link>{" "}
          or{" "}
          <Link to="/service-center">Service Center page</Link>{" "}
          for further information.
        </p>

        <h2>8. Acceptable Website Use</h2>
        <p>
          You agree not to misuse the website, attempt unauthorised
          access, interfere with its operation, submit fraudulent
          orders, or use the website for unlawful purposes.
        </p>

        <h2>9. Intellectual Property</h2>
        <p>
          Website text, design, branding, and other content may be
          protected by applicable intellectual-property laws.
          Product names and trademarks belong to their respective
          owners. You may not copy or commercially reuse website
          content without appropriate permission.
        </p>

        <h2>10. Website Availability</h2>
        <p>
          We aim to keep the website available and functioning,
          but we cannot guarantee uninterrupted access at all
          times. We may update, maintain, or change website features
          when necessary.
        </p>

        <h2>11. Limitation of Liability</h2>
        <p>
          To the extent permitted by law, we are not responsible
          for losses arising from circumstances beyond our
          reasonable control or from misuse of the website.
          This clause does not exclude liability or consumer
          rights that cannot legally be excluded.
        </p>

        <h2>12. Privacy</h2>
        <p>
          Our handling of personal information is explained in
          our <Link to="/privacy-policy">Privacy Policy</Link>.
        </p>

        <h2>13. Changes to These Terms</h2>
        <p>
          We may revise these terms as our website and business
          practices evolve. Updated terms will be published on
          this page with a revised date where appropriate.
        </p>

        <h2>14. Contact Us</h2>
        <p>
          <strong>VoltBridge Technologies</strong><br />
          Bihi Tower, 4th Floor, Suite 5, Nairobi, Kenya.
        </p>
        <p>
          Phone: <a href="tel:+254726147462">+254 726 147 462</a>
        </p>
        <p>
          WhatsApp:{" "}
          <a
            href="https://wa.me/254726147462"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact VoltBridge Technologies
          </a>
        </p>
      </section>
    </main>
  );
}
