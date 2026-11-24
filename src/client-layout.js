"use client";
import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

import { ReactLenis } from "lenis/react";

export default function ClientLayout({ children, footer }) {
  const pageRef = useRef();
  const pathname = usePathname();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1000);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const showFooter =
    pathname !== "/lookbook" &&
    pathname !== "/app" &&
    pathname !== "/login" &&
    pathname !== "/signup" &&
    pathname !== "/content";

  const page = (
    <div className="page" ref={pageRef}>
      {children}
      {showFooter ? footer : null}
    </div>
  );

  // Native scroll on mobile — Lenis smoothTouch causes noticeable lag.
  if (isMobile) {
    return page;
  }

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        smoothTouch: false,
        syncTouch: false,
        touchMultiplier: 2,
        wheelMultiplier: 1,
        lerp: 0.1,
      }}
    >
      {page}
    </ReactLenis>
  );
}
