
import { Link } from "react-router-dom";
import { Truck, PackageCheck, RefreshCw, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/254726147462?text=" +
  encodeURIComponent(
    "Hello VoltBridge Technologies. I need assistance with delivery or a return."
  );

export default function ShippingReturns() {
  return (
    <main className="container policy-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Shipping and Return Policy</span>
      </nav>

      <header className="policy-header">
        <span className="eyebrow">DELIVERY & CUSTOMER CARE</span>
        <h1>Shipping and Return Policy</h1>
        <p>
          Information about delivery arrangements, damaged or
          incorrect orders, returns, and refunds.
        </p>
        <p><small>Last updated: 21 October 2026</small></p>
      </header>

      <section className="policy-content">
        <div className="benefits-grid">
          <article>
            <Truck size={28} />
            <h2>Delivery Options</h2>
            <p>
              Nairobi delivery and countrywide shipping can be
              arranged. Delivery availability, fees, and estimated
              arrival times are confirmed when ordering.
            </p>
          </article>

          <article>
            <PackageCheck size={28} />
            <h2>Check Your Order</h2>
            <p>
              Please check your product as soon as reasonably
              possible after delivery and contact us if something
              appears damaged, defective, or incorrect.
            </p>
          </article>

          <article>
            <RefreshCw size={28} />
            <h2>Returns and Refunds</h2>
            <p>
              Return requests are assessed based on the issue,
              product condition, applicable terms, and your rights
              under Kenyan law.
            </p>
          </article>

          <article>
            <MessageCircle size={28} />
            <h2>Need Assistance?</h2>
            <p>
              Contact our team with your order details so we can
              explain the next steps.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary"
            >
              <MessageCircle size={17} />
              Contact Us
            </a>
          </article>
        </div>

        <h2>1. Shipping and Delivery</h2>
        <p>
          We arrange Nairobi delivery and countrywide shipping,
          subject to the destination and available delivery
          options. Please confirm the delivery fee and estimated
          delivery time before completing your order.
        </p>
        <p>
          Delivery estimates are provided for guidance and may
          change because of courier schedules, weather, access
          restrictions, or other circumstances outside our
          reasonable control.
        </p>
        <p>
          Please provide accurate contact and delivery details
          and ensure someone can receive the order at the agreed
          location.
        </p>

        <h2>2. Damaged, Defective, or Incorrect Products</h2>
        <p>
          If your order arrives damaged, appears defective, or
          contains the wrong product, contact us within
          <strong> 7 calendar days after receiving it</strong>,
          where reasonably possible. This is our requested
          reporting period to help us investigate the issue; it
          does not remove or reduce any rights you may have under
          applicable law.
        </p>
        <p>
          Please provide your order or purchase details and,
          where practical, photographs or a short video showing
          the issue. We may ask reasonable questions to assess
          the request.
        </p>
        <p>
          Depending on the circumstances, assessment, product
          availability, and applicable law, an appropriate remedy
          may include repair, replacement, or a refund.
        </p>

        <h2>3. Change-of-Mind Returns</h2>
        <p>
          If you change your mind after purchasing, contact us
          before returning the product. We will review the request
          based on the product's condition, the circumstances of
          the sale, any applicable terms, and Kenyan law.
        </p>
        <p>
          A change-of-mind return is not automatically guaranteed.
          However, nothing in this policy limits rights or remedies
          required by applicable law.
        </p>

        <h2>4. Product Condition and Packaging</h2>
        <p>
          Where reasonably possible, retain the product, supplied
          accessories, proof of purchase, and original packaging
          while we assess your request. Please follow our return
          instructions before sending a product back.
        </p>
        <p>
          Packaging requirements will be applied reasonably and
          consistently with applicable consumer-protection law.
        </p>

        <h2>5. Return Shipping or Collection</h2>
        <p>
          Contact us before arranging a return so we can confirm
          the process. Where an issue is attributable to us,
          we will explain the applicable return shipping or
          collection arrangements in accordance with the
          circumstances and applicable law.
        </p>

        <h2>6. Refunds and Exchanges</h2>
        <p>
          Once a return or complaint has been assessed, we will
          communicate the available resolution and any relevant
          next steps. Where a refund is due, we will explain the
          method and expected processing time. Refunds will
          generally be made through the original payment method
          where practical and appropriate.
        </p>
        <p>
          Exchanges depend on product availability. If the same
          item is unavailable, we will discuss appropriate
          alternatives or other remedies as applicable.
        </p>

        <h2>7. How to Request Help</h2>
        <p>
          Contact VoltBridge Technologies with your name, purchase
          details, the product concerned, and a description of
          the issue.
        </p>
        <p>
          WhatsApp:{" "}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            +254 726 147 462
          </a>
        </p>
        <p>
          Address: Bihi Tower, 4th Floor, Suite 5, Nairobi, Kenya.
        </p>

        <p>
          Please also review our{" "}
          <Link to="/terms-and-conditions">
            Terms and Conditions
          </Link>
          . This policy is subject to applicable Kenyan law and
          does not override statutory consumer rights.
        </p>
      </section>
    </main>
  );
}
