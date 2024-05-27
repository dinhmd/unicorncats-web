import { createRef, useEffect } from "react";
import styles from "./Header.module.css";

export default function Header() {
  const ref = createRef<HTMLDivElement>();

  useEffect(() => {
    const starCount = 100;

    for (let i = 0; i < starCount; i++) {
      let star = document.createElement("div");
      star.className = `${styles.star}`;
      star.style.top = Math.random() * 30 + "vh";
      star.style.left = Math.random() * 100 + "vw";
      let size = Math.random() * 3 + 2;
      star.style.width = size + "px";
      star.style.height = size + "px";
      if (ref.current) {
        ref.current.appendChild(star);
      }
    }
  }, []);

  return <div ref={ref} className="fixed w-screen h-[30] top-0 z-1" />;
}
