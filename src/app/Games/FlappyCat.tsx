import { createRef, useEffect, useState } from "react";
import useGame from "./useGame";

export default function FlappyCat() {
  const rootRef = createRef<HTMLDivElement>();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const { gameLoop } = useGame({ canvas });

  useEffect(() => {
    const interval = setInterval(gameLoop, 5000);
    return () => clearInterval(interval);
  }, [gameLoop]);

  return (
    <div ref={rootRef} className="w-full h-full">
      <canvas ref={setCanvas} id="canvas" width="276" height="414" />
    </div>
  );
}
