import "./Footer.css";
import Link from "next/link";

const footerNav = [
  {
    title: "Platform",
    links: [
      { label: "Home", href: "/" },
      { label: "Waitlist", href: "/waitlist" },
      { label: "Technologies", href: "/technologies" },
      { label: "For Organizations", href: "/organizations" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Developers", href: "/developers" },
      { label: "NRMLSS Lab", href: "/nrmlss-lab" },
      { label: "API & Integrations", href: "/developers/api" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Touchpoint", href: "/touchpoint" },
      { label: "Clinical Brief", href: "/clinical-brief" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: "https://www.instagram.com/nrmlss1", external: true },
      { label: "YouTube", href: "#", external: true },
      { label: "Press", href: "/press" },
    ],
  },
];

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-nav">
          {footerNav.map((column) => (
            <div className="footer-col" key={column.title}>
              <p className="footer-col-title">{column.title}</p>
              <ul className="footer-col-links">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <div className="footer-brand">
            <h5>NRMLSS</h5>
            <p className="footer-tagline">
              Continuous health intelligence for care teams.
            </p>
            <p className="footer-copyright">
              &copy; 2025 NRMLSS. All rights reserved.
            </p>
          </div>

          <div className="footer-legal">
            {legalLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
