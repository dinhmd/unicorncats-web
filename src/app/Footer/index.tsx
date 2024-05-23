import Image from "next/image";
import FlyCat from "@/assets/images/fly_cat.svg";
import styles from "./index.module.css";
import {
  Fragment,
  ReactNode,
  createElement,
  createRef,
  useEffect,
  useRef,
} from "react";
import anime from "animejs";

const cats: { src: string; top: number }[] = [
  {
    src: FlyCat,
    top: 0,
  },
  {
    src: FlyCat,
    top: 60,
  },
  {
    src: FlyCat,
    top: 120,
  },
];

export default function Footer() {
  const ref = createRef<HTMLDivElement>();

  function createCat() {
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
    for (let i = 0; i < 5; i++) {
      const bee = createCat();
      animate(bee);
    }
  }, []);

  const animate = (cat: HTMLElement) => {
    anime({
      targets: cat,
      translateX: () => Math.random() * window.innerWidth,
      translateY: () => Math.random() * (window.innerHeight - 420 - 80),
      duration: () => Math.random() * 3000 + 1000,
      easing: "easeInOutQuad",
      complete: () => animate(cat),
    });
  };

  return (
    <div
      ref={ref}
      style={{
        height: "calc(100vh - 420px - 80px)",
      }}
      className="w-full relative overflow-x-hidden overflow-y-hidden"
    />
  );
}
