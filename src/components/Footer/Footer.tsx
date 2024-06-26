import anime from "animejs";
import { createRef, useEffect } from "react";
import styles from "./Footer.module.css";

const beeCatSize = 5;

export default function Footer() {
  const ref = createRef<HTMLDivElement>();

  function createCat(index: number) {
    const cat = document.createElement("div");
    cat.classList.add(`${styles.cat_fly}`);
    cat.style.top = `0`;
    cat.style.left = `0`;
    if (ref.current) {
      ref.current.appendChild(cat);
    }
    return cat;
  }

  useEffect(() => {
    for (let i = 0; i < beeCatSize; i++) {
      const bee = createCat(i);
      animate(bee);
    }
  }, []);

  const animate = (cat: HTMLElement) => {
    anime({
      targets: cat,
      translateX: () => Math.random() * window.innerWidth,
      translateY: () => Math.random() * (window.innerHeight - 420 - 160),
      duration: () => Math.random() * 3000 + 1000,
      easing: "easeInOutQuad",
      complete: () => animate(cat),
    });
  };

  return (
    <div
      ref={ref}
      style={{
        height: "calc(100vh - 420px - 110px)",
      }}
      className={`${styles.footer} w-full relative overflow-x-hidden overflow-y-visible`}
    />
  );
}
