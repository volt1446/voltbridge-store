
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const WHATSAPP_URL =
  "https://wa.me/254726147462?text=" +
  encodeURIComponent(
    "Hello VoltBridge Technologies. I have a question about your products."
  );

const faqs = [
  {
    question: "What products does VoltBridge Technologies sell?",
    answer:
      "We offer phone accessories and everyday technology essentials, including Samsung and Apple accessories. Browse our Shop page to see the products currently listed."
  },
  {
    question: "How can I place an order?",
    answer:
      "Browse the products on our website, add items to your cart where available, and follow the checkout instructions. You can also contact us through WhatsApp to discuss an order."
  },
  {
    question: "How can I check product availability?",
    answer:
      "Check the product page for its current availability status. If you need confirmation before ordering, contact us with the product name."
  },
  {
    question: "Do you sell to both retail and wholesale customers?",
    answer:
      "Yes, retail and wholesale enquiries are welcome. Contact us to discuss the products and quantities you need."
  },
  {
    question: "Do you deliver outside Nairobi?",
    answer:
      "Countrywide shipping can be arranged, subject to destination and available delivery options. Contact us to confirm delivery charges and estimated arrival time."
  },
  {
    question: "Which payment methods do you accept?",
    answer:
      "Available payment arrangements are confirmed when your order is discussed. Please confirm the payment method and any applicable charges before completing your purchase."
  },
  {
    question: "How do I return a damaged or incorrect product?",
    answer:
      "Contact us as soon as reasonably possible with your purchase details and information about the issue. Our Shipping and Return Policy explains the process and requested reporting period, subject to your rights under applicable Kenyan law."
  },
  {
    question: "Do products come with a warranty?",
    answer:
      "Warranty coverage depends on the particular product and its applicable terms. Contact us before purchasing if you need to confirm the warranty for a specific item."
  },
  {
    question: "Can I request an extended warranty?",
    answer:
      "Please contact us to confirm whether an extended-warranty option is available for your chosen product. Availability and terms must be confirmed before purchase."
  },
  {
    question: "How can I contact VoltBridge Technologies?",
    answer:
      "You can call or WhatsApp us on +254 726 147 462. Our business address is Bihi Tower, 4th Floor, Suite 5, Nairobi, Kenya."
  }
];

export default function FAQs() {
  return (
    <main className="container policy-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>FAQs</span>
      </nav>

      <header className="policy-header">
        <span className="eyebrow">HELP & SUPPORT</span>
        <h1>Frequently Asked Questions</h1>
        <p>
          Find answers to common questions about products,
          ordering, delivery, payments, and returns.
        </p>
      </header>

      <section className="policy-content">
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details className="faq-item" key={faq.question}>
              <summary>
                <span>{faq.question}</span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>

        <div className="faq-contact">
          <h2>Still Have a Question?</h2>
          <p>
            Our team can help with product information,
            availability, orders, and delivery enquiries.
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="button button-primary"
          >
            <MessageCircle size={18} />
            Ask Us on WhatsApp
          </a>
        </div>

        <p>
          You can also read our{" "}
          <Link to="/shipping-and-return-policy">
            Shipping and Return Policy
          </Link>
          ,{" "}
          <Link to="/privacy-policy">Privacy Policy</Link>, and{" "}
          <Link to="/terms-and-conditions">
            Terms and Conditions
          </Link>.
        </p>
      </section>
    </main>
  );
}
