
import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Users, MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/254726147462?text=" +
  encodeURIComponent(
    "Hello VoltBridge Technologies. I would like to learn more about your products."
  );

export default function About() {
  return (
    <main className="container policy-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>About Us</span>
      </nav>

      <header className="policy-header">
        <span className="eyebrow">OUR COMPANY</span>
        <h1>About VoltBridge Technologies</h1>
        <p>
          Your destination for phone accessories and everyday
          technology essentials in Nairobi, Kenya.
        </p>
      </header>

      <section className="policy-content">
        <h2>Who We Are</h2>
        <p>
          VoltBridge Technologies is a Nairobi-based technology
          accessories business serving customers looking for
          practical accessories for their everyday devices.
        </p>
        <p>
          We welcome both retail and wholesale enquiries and aim
          to make it convenient for customers to explore products,
          check availability, and contact our team before ordering.
        </p>

        <h2>What We Offer</h2>
        <p>
          Our product range includes phone chargers, charging
          cables, and other technology accessories. Product
          availability and specifications are displayed on our
          website where information is available.
        </p>

        <div className="benefits-grid">
          <article>
            <ShieldCheck size={28} />
            <h3>Quality-focused</h3>
            <p>
              We aim to provide clear product information to help
              customers make informed purchasing decisions.
            </p>
          </article>

          <article>
            <Truck size={28} />
            <h3>Delivery options</h3>
            <p>
              Nairobi delivery and countrywide shipping can be
              arranged. Charges and delivery times are confirmed
              when an order is discussed.
            </p>
          </article>

          <article>
            <Users size={28} />
            <h3>Retail and wholesale</h3>
            <p>
              We welcome individual customers and wholesale
              enquiries.
            </p>
          </article>

          <article>
            <MessageCircle size={28} />
            <h3>Direct assistance</h3>
            <p>
              Contact our team for product enquiries, orders, and
              availability information.
            </p>
          </article>
        </div>

        <h2>Visit or Contact Us</h2>
        <p>
          <strong>Address:</strong> Bihi Tower, 4th Floor, Suite 5,
          Nairobi, Kenya.
        </p>

        <p>
          <strong>Phone:</strong>{" "}
          <a href="tel:+254726147462">+254 726 147 462</a>
        </p>

        <p>
          <strong>Business enquiries:</strong> Contact us through
          WhatsApp for assistance with products and orders.
        </p>

        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="button button-primary"
        >
          Contact us on WhatsApp
        </a>
      </section>
    </main>
  );
}
