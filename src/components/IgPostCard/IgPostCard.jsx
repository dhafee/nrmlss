"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";

function SlideContent({ slide }) {
  return (
    <div className="ig-post-inner">
      {slide.eyebrow ? <p className="ig-eyebrow">{slide.eyebrow}</p> : null}
      <h2 className="ig-title">
        {slide.headline}
        {slide.accent ? <em> {slide.accent}</em> : null}
      </h2>
      {slide.footer ? <p className="ig-footer">{slide.footer}</p> : null}
    </div>
  );
}

export default function IgPostCard({ post }) {
  const isCarousel = Array.isArray(post.slides) && post.slides.length > 1;
  const slides = isCarousel
    ? post.slides
    : [
        {
          eyebrow: post.eyebrow,
          headline: post.headline,
          accent: post.accent,
          footer: post.footer,
        },
      ];

  const postRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const exportNode = async (node, filename) => {
    const width = node.offsetWidth || 540;
    const pixelRatio = Math.max(2, 1080 / width);
    const dataUrl = await toPng(node, {
      cacheBust: true,
      pixelRatio,
      backgroundColor: "#ffffff",
    });
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    link.click();
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    const previousSlide = activeSlide;

    try {
      if (isCarousel) {
        for (let i = 0; i < slides.length; i += 1) {
          setActiveSlide(i);
          await new Promise((resolve) => window.requestAnimationFrame(resolve));
          await new Promise((resolve) => window.setTimeout(resolve, 80));
          if (!postRef.current) continue;
          await exportNode(
            postRef.current,
            `nrmlss-${post.id}-${String(i + 1).padStart(2, "0")}.png`,
          );
          await new Promise((resolve) => window.setTimeout(resolve, 120));
        }
        setActiveSlide(previousSlide);
      } else if (postRef.current) {
        await exportNode(postRef.current, `nrmlss-${post.id}.png`);
      }
    } catch (error) {
      console.error("Failed to export post", error);
      setActiveSlide(previousSlide);
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(post.caption);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error("Failed to copy caption", error);
    }
  };

  return (
    <article className={`content-card${isCarousel ? " content-card--carousel" : ""}`}>
      <div className="content-card-meta">
        <span>{post.label}</span>
        <span>
          {isCarousel
            ? `Carousel · ${slides.length} slides`
            : "Single · 1080 × 1080"}
        </span>
      </div>

      {isCarousel ? (
        <div className="ig-carousel">
          <div className="ig-post" ref={postRef}>
            <SlideContent slide={slides[activeSlide]} />
          </div>

          <div className="ig-carousel-controls">
            <button
              type="button"
              className="content-btn content-btn-ghost"
              onClick={() =>
                setActiveSlide((current) =>
                  current === 0 ? slides.length - 1 : current - 1,
                )
              }
            >
              Prev
            </button>
            <div className="ig-carousel-dots">
              {slides.map((slide, index) => (
                <button
                  key={`${post.id}-dot-${index}`}
                  type="button"
                  className={
                    activeSlide === index
                      ? "ig-carousel-dot is-active"
                      : "ig-carousel-dot"
                  }
                  aria-label={`Slide ${index + 1}`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
            <button
              type="button"
              className="content-btn content-btn-ghost"
              onClick={() =>
                setActiveSlide((current) =>
                  current === slides.length - 1 ? 0 : current + 1,
                )
              }
            >
              Next
            </button>
          </div>
          <p className="ig-carousel-count">
            Slide {activeSlide + 1} of {slides.length}
          </p>
        </div>
      ) : (
        <div className="ig-post" ref={postRef}>
          <SlideContent slide={slides[0]} />
        </div>
      )}

      <div className="content-card-actions">
        <button
          type="button"
          className="content-btn"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading
            ? "Exporting…"
            : isCarousel
              ? "Download all slides"
              : "Download PNG"}
        </button>
        <button
          type="button"
          className="content-btn content-btn-ghost"
          onClick={handleCopyCaption}
        >
          {copied ? "Copied" : "Copy caption"}
        </button>
      </div>

      <div className="content-caption">
        <p className="content-kicker">Caption</p>
        <pre>{post.caption}</pre>
      </div>
    </article>
  );
}
