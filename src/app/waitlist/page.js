import Link from "next/link";

import {
  getWaitlistProductHref,
  waitlistProducts,
} from "@/data/waitlistProducts";
import "@/app/waitlist/waitlist.css";

export default function WaitlistIndexPage() {
  return (
    <main className="waitlist-page">
      <section className="waitlist-index-hero">
        <div className="container">
          <p className="waitlist-kicker light">NRMLSS Waitlist</p>
          <h1>Choose your device.</h1>
          <p className="waitlist-lead light">
            Select a product to join its waitlist and get notified at launch.
          </p>
        </div>
      </section>

      <section className="waitlist-index-main">
        <div className="container">
          <div className="waitlist-index-grid">
            {waitlistProducts.map((product) => (
              <Link
                key={product.id}
                href={getWaitlistProductHref(product.id)}
                className="waitlist-index-card"
              >
                <div className="waitlist-index-card-media">
                  <img src={product.image} alt={product.name} />
                  <div className="waitlist-showcase-meta">
                    <p>{product.name}</p>
                    <p>{product.price}</p>
                  </div>
                </div>
                <div className="waitlist-index-card-body">
                  <p>{product.description}</p>
                  <span>Join waitlist</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
