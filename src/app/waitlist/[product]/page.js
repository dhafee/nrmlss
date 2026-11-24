import { notFound } from "next/navigation";

import WaitlistPage from "@/components/WaitlistPage/WaitlistPage";
import {
  getWaitlistProduct,
  waitlistProducts,
} from "@/data/waitlistProducts";
import "@/app/waitlist/waitlist.css";

export default async function Page({ params, searchParams }) {
  const { product: productId } = await params;
  const query = await searchParams;
  const product = getWaitlistProduct(productId);

  if (!product) {
    notFound();
  }

  const initialMode =
    query?.mode === "preorder" ? "preorder" : "waitlist";

  return <WaitlistPage product={product} initialMode={initialMode} />;
}

export function generateStaticParams() {
  return waitlistProducts.map((product) => ({ product: product.id }));
}
