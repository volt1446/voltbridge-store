
import { Link } from "react-router-dom";
import { MapPin, Phone, MessageCircle, Clock } from "lucide-react";

const PHONE_NUMBER = "+254726147462";
const WHATSAPP_URL =
  "https://wa.me/254726147462?text=" +
  encodeURIComponent(
    "Hello VoltBridge Technologies. I need assistance with a product or order."
  );

export default function Contact() {
  return (
    <main className="container policy-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Contact Us</span>
      </nav>

      <header className="policy-header">
        <span className="eyebrow">WE'RE HERE TO HELP</span>
        <h1>Contact VoltBridge Technologies</h1>
        <p>
          Have a question about a product, stock availability,
          delivery, or a wholesale order? Get in touch with us.
        </p>
      </header>

      <section className="policy-content">
        <div className="benefits-grid">
          <article>
            <MessageCircle size={28} />
            <h2>WhatsApp</h2>
            <p>
              Message us about products, prices, availability,
              and orders.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-primary"
            >
              Chat on WhatsApp
            </a>
          </article>

          <article>
            <Phone size={28} />
            <h2>Call Us</h2>
            <p>
              Speak to our team about your enquiry.
            </p>
            <a href={`tel:${PHONE_NUMBER}`}>
              {PHONE_NUMBER}
            </a>
          </article>

          <article>
            <MapPin size={28} />
            <h2>Our Location</h2>
            <p>
              Bihi Tower, 4th Floor, Suite 5,
              Nairobi, Kenya.
            </p>
          </article>

          <article>
            <Clock size={28} />
            <h2>Business Hours</h2>
            <p>
              Contact us to confirm our current operating hours
              before visiting.
            </p>
          </article>
        </div>

        <h2>How We Can Help</h2>
        <p>
          Contact us for questions about Samsung and Apple
          accessories, product specifications, stock availability,
          retail purchases, wholesale enquiries, delivery, or
          after-sales assistance.
        </p>

        <p>
          For faster assistance, include the product name and,
          where applicable, your order details in your message.
        </p>

        <p>
          You can also browse our products on the{" "}
          <Link to="/#products">Shop page</Link>.
        </p>
      </section>
    </main>
  );
}
