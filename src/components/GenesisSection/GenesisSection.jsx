"use client";
import "./GenesisSection.css";
import { useRef } from "react";

import Copy from "@/components/Copy/Copy";
import TextBlock from "@/components/TextBlock/TextBlock";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const previewColumns = [
  ["/chiron/n1.png", "/chiron/n2.png", "/chiron/n3.png"],
  ["/chiron/n4.png", "/chiron/n5.png", "/chiron/n1.png"],
  ["/chiron/n2.png", "/chiron/c8.jpg", "/chiron/n4.png"],
  ["/chiron/n5.png", "/chiron/n1.png", "/chiron/n2.png"],
  ["/chiron/n3.png", "/chiron/n4.png", "/chiron/n5.png"],
];

const GenesisSection = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const root = containerRef.current;
      if (!root) return;

      ScrollTrigger.create({
        trigger: root.querySelector(".project-page-whitespace"),
        start: "top bottom",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          const projectPreviewWrapper = root.querySelector(
            ".project-preview-wrapper"
          );
          const previewCols = root.querySelectorAll(
            ".preview-col:not(.main-preview-col)"
          );
          const mainPreviewImg = root.querySelector(
            ".preview-img.main-preview-img img"
          );

          if (!projectPreviewWrapper || !previewCols.length || !mainPreviewImg)
            return;

          const previewScreenWidth = window.innerWidth;
          const previewMaxScale = previewScreenWidth < 900 ? 4 : 2.65;

          const scale = 1 + self.progress * previewMaxScale;
          const yPreviewColTranslate = self.progress * 300;
          const mainPreviewImgScale = 2 - self.progress * 0.85;

          projectPreviewWrapper.style.transform = `translate(-50%, -50%) scale(${scale})`;

          previewCols.forEach((previewCol) => {
            previewCol.style.transform = `translateY(${yPreviewColTranslate}px)`;
          });

          mainPreviewImg.style.transform = `scale(${mainPreviewImgScale})`;
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <div className="genesis-section" ref={containerRef}>
      <section className="project-preview">
        <div className="project-preview-wrapper">
          {previewColumns.map((column, columnIndex) => (
            <div
              key={columnIndex}
              className={`preview-col ${
                columnIndex === 2 ? "main-preview-col" : ""
              }`}
            >
              {column.map((image, imageIndex) => (
                <div
                  key={`${columnIndex}-${imageIndex}`}
                  className={`preview-img ${
                    columnIndex === 2 && imageIndex === 1
                      ? "main-preview-img"
                      : ""
                  }`}
                >
                  <img src={image} alt="" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="genesis-hero">
        <div className="gen-hero-img">
          <img src="/chiron/c8.jpg" alt="" />
        </div>
        <div className="container">
          <div className="gen-hero-copy">
            <Copy animateOnScroll={false} delay={0.7} type="flicker">
              <p>Signal over noise,</p>
              <p>Insight over intuition,</p>
              <p>Precision by design.</p>
            </Copy>
          </div>
          <div className="gen-hero-copy">
            <Copy animateOnScroll={false} delay={0.8} type="flicker">
              <p>We build health systems,</p>
              <p>Engineered for the now.</p>
            </Copy>
          </div>
          <div className="gen-hero-copy">
            <Copy animateOnScroll={false} delay={0.7}>
              <h1>The science behind how you perform</h1>
            </Copy>
            <div className="gen-hero-meta">
              <div className="gen-hero-meta-block">
                <Copy animateOnScroll={false} delay={0.9} type="flicker">
                  <p>We create frameworks,</p>
                  <p>For continuous care,</p>
                  <p>A study in biometrics.</p>
                </Copy>
              </div>
              <div className="gen-hero-meta-block">
                <Copy animateOnScroll={false} delay={1} type="flicker">
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
