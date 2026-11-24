"use client";
import "./GenesisSection.css";
import { useEffect, useMemo, useRef, useState } from "react";

import Copy from "@/components/Copy/Copy";
import TextBlock from "@/components/TextBlock/TextBlock";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const previewColumnsDesktop = [
  ["/chiron/n1.png", "/chiron/n2.png", "/chiron/n3.png"],
  ["/chiron/n4.png", "/chiron/n5.png", "/chiron/n1.png"],
  ["/chiron/n2.png", "/chiron/c8.jpg", "/chiron/n4.png"],
  ["/chiron/n5.png", "/chiron/n1.png", "/chiron/n2.png"],
  ["/chiron/n3.png", "/chiron/n4.png", "/chiron/n5.png"],
];

const previewColumnsMobile = [
  ["/chiron/n1.png", "/chiron/n5.png"],
  ["/chiron/n2.png", "/chiron/c8.jpg", "/chiron/n4.png"],
  ["/chiron/n3.png", "/chiron/n5.png"],
];

const GenesisSection = () => {
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mqMobile = window.matchMedia("(max-width: 900px)");
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setIsMobile(mqMobile.matches);
      setReduceMotion(mqMotion.matches);
    };

    sync();
    mqMobile.addEventListener("change", sync);
    mqMotion.addEventListener("change", sync);
    return () => {
      mqMobile.removeEventListener("change", sync);
      mqMotion.removeEventListener("change", sync);
    };
  }, []);

  const previewColumns = useMemo(
    () => (isMobile ? previewColumnsMobile : previewColumnsDesktop),
    [isMobile],
  );

  const mainColIndex = isMobile ? 1 : 2;

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root || reduceMotion) return;

      const projectPreviewWrapper = root.querySelector(
        ".project-preview-wrapper",
      );
      const previewCols = root.querySelectorAll(
        ".preview-col:not(.main-preview-col)",
      );
      const mainPreviewImg = root.querySelector(
        ".preview-img.main-preview-img img",
      );

      if (!projectPreviewWrapper || !previewCols.length || !mainPreviewImg) {
        return;
      }

      const setWrapper = gsap.quickSetter(projectPreviewWrapper, "css");
      const setMainImg = gsap.quickSetter(mainPreviewImg, "css");
      const setCols = Array.from(previewCols).map((col) =>
        gsap.quickSetter(col, "css"),
      );

      const trigger = ScrollTrigger.create({
        trigger: root.querySelector(".project-page-whitespace"),
        start: "top bottom",
        end: "bottom bottom",
        scrub: isMobile ? true : 0.35,
        onUpdate: (self) => {
          const previewMaxScale = isMobile ? 1.75 : 2.65;
          const scale = 1 + self.progress * previewMaxScale;
          const yPreviewColTranslate = self.progress * (isMobile ? 140 : 300);
          const mainPreviewImgScale = 2 - self.progress * (isMobile ? 0.55 : 0.85);

          setWrapper({
            transform: `translate3d(-50%, -50%, 0) scale(${scale})`,
          });

          setCols.forEach((setCol) => {
            setCol({
              transform: `translate3d(0, ${yPreviewColTranslate}px, 0)`,
            });
          });

          setMainImg({
            transform: `translate3d(0, 0, 0) scale(${mainPreviewImgScale})`,
          });
        },
      });

      return () => {
        trigger.kill();
      };
    },
    {
      scope: containerRef,
      dependencies: [isMobile, reduceMotion, previewColumns],
      revertOnUpdate: true,
    },
  );

  return (
    <div
      className={`genesis-section${isMobile ? " is-mobile" : ""}${reduceMotion ? " is-reduced-motion" : ""}`}
      ref={containerRef}
    >
      <section className="project-preview">
        <div className="project-preview-wrapper">
          {previewColumns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={`preview-col ${
                columnIndex === mainColIndex ? "main-preview-col" : ""
              }`}
            >
              {column.map((image, imageIndex) => {
                const isMain =
                  columnIndex === mainColIndex &&
                  imageIndex === (isMobile ? 1 : 1);
                return (
                  <div
                    key={`${columnIndex}-${imageIndex}`}
                    className={`preview-img ${isMain ? "main-preview-img" : ""}`}
                  >
                    <img
                      src={image}
                      alt=""
                      loading={isMain ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      <section className="genesis-hero">
        <div className="gen-hero-img">
          <img
            src="/chiron/c8.jpg"
            alt=""
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
        <div className="container">
          <div className="gen-hero-copy">
            <Copy animateOnScroll={false} delay={isMobile ? 0.2 : 0.7} type="flicker">
              <p>Signal over noise,</p>
              <p>Insight over intuition,</p>
              <p>Precision by design.</p>
            </Copy>
          </div>
          <div className="gen-hero-copy">
            <Copy animateOnScroll={false} delay={isMobile ? 0.25 : 0.8} type="flicker">
              <p>We build health systems,</p>
              <p>Engineered for the now.</p>
            </Copy>
          </div>
          <div className="gen-hero-copy">
            <Copy animateOnScroll={false} delay={isMobile ? 0.2 : 0.7}>
              <h1>The science behind how you perform</h1>
            </Copy>
            <div className="gen-hero-meta">
              <div className="gen-hero-meta-block">
                <Copy
                  animateOnScroll={false}
                  delay={isMobile ? 0.3 : 0.9}
                  type="flicker"
                >
                  <p>We create frameworks,</p>
                  <p>For continuous care,</p>
                  <p>A study in biometrics.</p>
                </Copy>
              </div>
              <div className="gen-hero-meta-block">
                <Copy
                  animateOnScroll={false}
                  delay={isMobile ? 0.35 : 1}
                  type="flicker"
                >
                  <p>[ SYS/NRMLSS/0001 ]</p>
                </Copy>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="genesis-about">
        <div className="container">
          <div className="genesis-about-copy">
            <Copy>
              <h4>
                NRMLSS turns continuous wearable signals into clear, proactive
                health insight.
              </h4>
            </Copy>
          </div>
        </div>
      </section>

      <section className="project-page-whitespace"></section>

      <TextBlock />
    </div>
  );
};

export default GenesisSection;
