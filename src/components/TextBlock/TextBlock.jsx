import "./TextBlock.css";
import Link from "next/link";

import Copy from "../Copy/Copy";
import { waitlistProducts } from "@/data/waitlistProducts";

const TextBlock = () => {
  return (
    <section className="text-block">
      <div className="container">
        <div className="text-block-col">
          <Copy>
            <h3>Preorder Your NRMLSS.</h3>
          </Copy>
          <div className="text-block-waitlist-list text-block-waitlist-list--single">
            {waitlistProducts
              .filter((product) => product.id === "nrmlss-band-ceramic")
              .map((product) => (
                <article className="text-block-waitlist-card" key={product.name}>
                  <div className="text-block-waitlist-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="text-block-waitlist-body">
                    <div className="text-block-waitlist-meta">
                      <h5>{product.name}</h5>
                      <p className="bodyCopy sm">{product.price}</p>
                    </div>
                    <Link
                      href={`/waitlist/${product.id}?mode=preorder`}
                      className="text-block-waitlist-btn"
                    >
                      Preorder
                    </Link>
                  </div>
                </article>
              ))}
          </div>
        </div>
        <div className="text-block-col">
          <div className="text-block-copy">
            <Copy>
              <p className="bodyCopy sm">
                Be first to access NRMLSS updates, pilot launches, and product
                drops built for continuous health intelligence.
              </p>
            </Copy>
          </div>
          <form
            className="text-block-subscribe"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              aria-label="Email address"
              required
            />
            <button type="submit">Subscribe</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default TextBlock;
