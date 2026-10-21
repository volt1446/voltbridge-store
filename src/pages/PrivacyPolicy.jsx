
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <main className="container policy-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <span>Privacy Policy</span>
      </nav>

      <header className="policy-header">
        <span className="eyebrow">YOUR PRIVACY</span>
        <h1>Privacy Policy</h1>
        <p>
          How VoltBridge Technologies handles information when
          you browse our website or contact us.
        </p>
        <p><small>Last updated: 21 October 2026</small></p>
      </header>

      <section className="policy-content">
        <h2>1. Introduction</h2>
        <p>
          VoltBridge Technologies respects your privacy. This
          policy explains the types of information that may be
          collected when you use our website, enquire about
          products, or place an order.
        </p>

        <h2>2. Information We May Collect</h2>
        <p>Depending on how you interact with us, we may collect:</p>
        <ul>
          <li>
            Contact details such as your name, phone number,
            email address, and delivery address.
          </li>
          <li>
            Order details, including products requested, quantities,
            and relevant purchase information.
          </li>
          <li>
            Messages you send through WhatsApp, telephone, or
            other communication channels.
          </li>
          <li>
            Basic technical and usage information that may be
            collected by website hosting, security, or analytics
            services where enabled.
          </li>
        </ul>

        <h2>3. How We Use Information</h2>
        <p>We may use information to:</p>
        <ul>
          <li>Respond to enquiries and provide customer support.</li>
          <li>Process orders and coordinate delivery.</li>
          <li>Confirm product availability and order details.</li>
          <li>Handle returns, complaints, and after-sales requests.</li>
          <li>Maintain website security and improve our services.</li>
          <li>Meet applicable legal obligations.</li>
        </ul>

        <h2>4. Payments</h2>
        <p>
          Payment arrangements are confirmed during the ordering
          process. Please do not send passwords, PINs, or other
          confidential banking credentials through our website
          or messages. If a third-party payment service is used,
          its own privacy terms may also apply.
        </p>

        <h2>5. Sharing Information</h2>
        <p>
          We do not intend to sell customers' personal information.
          Information may be shared with service providers when
          reasonably necessary to operate the website, communicate
          with customers, fulfil orders, arrange delivery, maintain
          security, or comply with the law.
        </p>
        <p>
          Third-party services, including WhatsApp, website hosting,
          and database providers, may process information under
          their own privacy policies and terms.
        </p>

        <h2>6. Data Security and Retention</h2>
        <p>
          We take reasonable steps to protect information against
          unauthorised access, loss, or misuse. No method of
          electronic storage or transmission can be guaranteed
          to be completely secure.
        </p>
        <p>
          Information may be retained for as long as reasonably
          necessary for customer service, order records, security,
          dispute resolution, and legal requirements.
        </p>

        <h2>7. Cookies and Website Technologies</h2>
        <p>
          Our website or its service providers may use cookies,
          local storage, or similar technologies where necessary
          for website functionality, security, preferences, or
          analytics. The technologies in use depend on the
          services enabled on the website.
        </p>

        <h2>8. Your Privacy Rights</h2>
        <p>
          Subject to applicable Kenyan law, you may have rights
          to request access to your personal information, ask
          for correction, request deletion where permitted, or
          object to certain processing.
        </p>
        <p>
          To make a privacy request, contact us using the details
          below. We may need to verify your identity before
          responding.
        </p>

        <h2>9. Children's Information</h2>
        <p>
          Our website is intended for general customers and is
          not designed to knowingly collect children's personal
          information unnecessarily. A parent or guardian may
          contact us about information submitted by a child.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this policy when our practices or legal
          requirements change. The latest revision date will be
          shown at the top of this page.
        </p>

        <h2>11. Contact Us</h2>
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
            href="https://wa.me/254726147462?text=Hello%20VoltBridge%20Technologies.%20I%20have%20a%20privacy%20enquiry."
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact us about privacy
          </a>
        </p>

        <p>
          This policy is intended as a starting point and should
          reflect the actual technologies and data practices used
          by the business. It does not replace advice on compliance
          with applicable Kenyan data protection law.
        </p>
      </section>
    </main>
  );
}
