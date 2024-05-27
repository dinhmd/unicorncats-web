/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useEffect, useState } from "react";
import Ground from "@/assets/images/flappy/ground.png";
import Background from "@/assets/images/flappy/BG.png";
import TopPipe from "@/assets/images/flappy/xx_top.png";
import BotPipe from "@/assets/images/flappy/xx_bottom.png";
import Go from "@/assets/images/flappy/go.png";
import GetReady from "@/assets/images/flappy/getready.png";
import T0 from "@/assets/images/flappy/tap/t0.png";
import T1 from "@/assets/images/flappy/tap/t1.png";
import B0 from "@/assets/images/flappy/bird/c1.png";
import B1 from "@/assets/images/flappy/bird/c1.png";
import B2 from "@/assets/images/flappy/bird/c1.png";
import { cloneDeep } from "lodash";

// Constants and utilities
const RAD = Math.PI / 180;
const DX = 3;
const PipeGap = 85;

type Bird = {
  x: number;
  y: number;
  speed: number;
  gravity: number;
  thrust: number;
  rotation: number;
  frame: number;
};

type Coordinates = {
  x: number;
  y: number;
};

const initialBirdState = {
  x: 50,
  y: 100,
  speed: 0,
  gravity: 0.11,
  thrust: 2.5,
  rotation: 0,
  frame: 0,
};

const initialState = {
  getReady: 0,
  Play: 1,
  gameOver: 2,
};

const FlappyCatGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frames, setFrames] = useState(0);
  const [state, setState] = useState<number>(initialState.getReady);
  const [bird, setBird] = useState<Bird>(initialBirdState);
  const [gnd, setGnd] = useState<Coordinates>({
    x: 0,
    y: 0,
  });

  const [pipe, setPipe] = useState<{
    pipes: Coordinates[];
    moved: boolean;
  }>({
    pipes: [],
    moved: true,
  });
  const [uiFrame, setUIFrame] = useState(0);
  const [score, setScore] = useState(0);
  const [sfxPlayed, setSfxPlayed] = useState(false);
  const sfx = useRef({
    start: new Audio(),
    flap: new Audio(),
    score: new Audio(),
    hit: new Audio(),
    die: new Audio(),
  });

  const images = useRef({
    bg: new Image(),
    ground: new Image(),
    pipeTop: new Image(),
    pipeBottom: new Image(),
    bird: [new Image(), new Image(), new Image(), new Image()],
    getReady: new Image(),
    gameOver: new Image(),
    tap: [new Image(), new Image()],
  });

  useEffect(() => {
    images.current.bg.src = Background.src;
    images.current.ground.src = Ground.src;
    images.current.pipeTop.src = TopPipe.src;
    images.current.pipeBottom.src = BotPipe.src;
    images.current.bird[0].src = B0.src;
    images.current.bird[1].src = B1.src;
    images.current.bird[2].src = B2.src;
    images.current.bird[3].src = B0.src;
    images.current.getReady.src = GetReady.src;
    images.current.gameOver.src = Go.src;
    images.current.tap[0].src = T0.src;
    images.current.tap[1].src = T1.src;

    sfx.current.die = new Audio("/sfx/die.wav");
    sfx.current.flap = new Audio("/sfx/flap.wav");
    sfx.current.hit = new Audio("/sfx/hit.wav");
    sfx.current.score = new Audio("/sfx/score.wav");
    sfx.current.start = new Audio("/sfx/start.wav");

    const interval = setInterval(gameLoop, 20);
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "KeyW" || e.code === "ArrowUp") {
        handleGameAction();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state]);

  useEffect(() => {
    update();
  }, [frames, state]);

  useEffect(() => {
    updateBird();
  }, [frames, state, sfxPlayed]);

  useEffect(() => {
    draw();
  }, [frames, score, uiFrame, gnd, pipe, bird, state]);

  const handleGameAction = () => {
    switch (state) {
      case initialState.getReady:
        setState(initialState.Play);
        sfx.current.start.play();
        break;
      case initialState.Play:
        flap();
        break;
      case initialState.gameOver:
        resetGame();
        break;
      default:
        break;
    }
  };

  const flap = () => {
    setBird((prev) => ({
      ...prev,
      speed: -prev.thrust,
    }));
    sfx.current.flap.play();
  };

  const resetGame = () => {
    setState(initialState.getReady);
    setBird(initialBirdState);
    setPipe({ pipes: [], moved: true });
    setScore(0);
    setSfxPlayed(false);
  };

  const gameLoop = () => {
    setFrames((prev) => prev + 1);
  };

  const update = () => {
    updateGround();
    updatePipes();
    updateUI();
  };

  const birdRotation = (_bird: Bird) => {
    let rotation = _bird.rotation;
    if (_bird.speed <= 0) {
      rotation = Math.max(-25, (-25 * _bird.speed) / (-1 * _bird.thrust));
    } else if (_bird.speed > 0) {
      rotation = Math.min(90, (90 * _bird.speed) / (_bird.thrust * 2));
    }
    return rotation;
  };

  const birdCollided = (_bird: Bird) => {
    if (!pipe.pipes.length) return false;
    const currentBirdImage = images.current.bird[bird.frame];
    let x = pipe.pipes[0].x;
    let y = pipe.pipes[0].y;
    let r = currentBirdImage.height / 4 + currentBirdImage.width / 4;
    let roof = y + images.current.pipeTop.height;
    let floor = roof + PipeGap;
    let w = images.current.pipeTop.width;
    if (_bird.x + r >= x) {
      if (_bird.x + r < x + w) {
        if (_bird.y - r <= roof || _bird.y + r >= floor) {
          sfx.current.hit.play();
          return true;
        }
      } else if (pipe.moved) {
        setScore((prev) => prev + 1);
        sfx.current.score.play();
        setPipe({ ...pipe, moved: false });
      }
    }
    return false;
  };

  const updateBird = () => {
    const _bird = { ...bird };
    const r = images.current.bird[_bird.frame].width / 2;
    switch (state) {
      case initialState.getReady:
        _bird.rotation = 0;
        _bird.y += frames % 10 == 0 ? Math.sin(frames * RAD) : 0;
        _bird.frame += frames % 10 == 0 ? 1 : 0;
        break;
      case initialState.Play:
        _bird.frame += frames % 5 == 0 ? 1 : 0;
        _bird.y += _bird.speed;
        _bird.rotation = birdRotation(_bird);
        _bird.speed += _bird.gravity;
        if (gnd.y > 0 && (_bird.y + r >= gnd.y || birdCollided(_bird))) {
          setState(initialState.gameOver);
        }

        break;
      case initialState.gameOver:
        _bird.frame = 1;
        if (_bird.y + r < gnd.y) {
          _bird.y += _bird.speed;
          _bird.rotation = birdRotation(_bird);
          _bird.speed += _bird.gravity * 2;
        } else {
          _bird.speed = 0;
          _bird.y = gnd.y - r;
          _bird.rotation = 90;
          if (!sfxPlayed) {
            sfx.current.die.play();
            setSfxPlayed(true);
          }
        }

        break;
    }
    _bird.frame = _bird.frame % images.current.bird.length;
    setBird(_bird);
  };

  const updateGround = () => {
    if (state != initialState.Play || !canvasRef.current) return;
    const _gnd = cloneDeep(gnd);
    _gnd.x -= DX;
    _gnd.x = _gnd.x % (images.current.ground.width / 2);
    _gnd.y = canvasRef.current.height - images.current.ground.height;
    setGnd(_gnd);
  };

  const updatePipes = () => {
    if (state != initialState.Play || !canvasRef.current) return;
    const _pipe = cloneDeep(pipe);
    const pipeTopImage = images.current.pipeTop;
    if (frames % 100 == 0) {
      _pipe.pipes.push({
        x: canvasRef.current.width,
        y: -210 * Math.min(Math.random() + 1, 1.8),
      });
    }
    _pipe.pipes.forEach((pipe) => {
      pipe.x -= DX;
    });

    if (_pipe.pipes.length && _pipe.pipes[0].x < -pipeTopImage.width) {
      _pipe.pipes.shift();
      _pipe.moved = true;
    }
    setPipe(_pipe);
  };

  const updateUI = () => {
    if (state == initialState.Play) return;
    let _frame = uiFrame;
    _frame += frames % 10 == 0 ? 1 : 0;
    _frame = _frame % images.current.tap.length;
    setUIFrame(_frame);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");

    if (context) {
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height / 2);
      gradient.addColorStop(0, "#74dcf7");
      gradient.addColorStop(1, "#f0de7b");
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      drawBackground(context);
      drawPipes(context);
      drawBird(context);
      drawGround(context);
      drawUI(context);
    }
  };

  const drawBackground = (context: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return;
    context.drawImage(
      images.current.bg,
      0,
      canvasRef.current.height / 3,
      canvasRef.current.width,
      canvasRef.current.height - images.current.ground.height
    );
  };

  const drawPipes = (context: CanvasRenderingContext2D) => {
    const pipeTopImage = images.current.pipeTop;
    const pipeBotImage = images.current.pipeBottom;
    for (let i = 0; i < pipe.pipes.length; i++) {
      let p = pipe.pipes[i];
      context.drawImage(pipeTopImage, p.x, p.y);
      context.drawImage(pipeBotImage, p.x, p.y + pipeTopImage.height + PipeGap);
    }
  };

  const drawBird = (context: CanvasRenderingContext2D) => {
    const currentBirdImage = images.current.bird[bird.frame];
    const { x, y, rotation } = bird;

    context.save();
    context.translate(x, y);
    context.rotate(rotation * RAD);
    context.drawImage(
      currentBirdImage,
      -currentBirdImage.width / 2,
      -currentBirdImage.height / 2
    );
    context.restore();
  };

  const drawGround = (context: CanvasRenderingContext2D) => {
    if (!canvasRef.current) return;
    console.log(gnd.x);
    context.drawImage(
      images.current.ground,
      gnd.x,
      canvasRef.current.height - images.current.ground.height,
      images.current.ground.width + 80,
      images.current.ground.height
    );
  };

  const drawUI = (context: CanvasRenderingContext2D) => {
    switch (state) {
      case initialState.getReady:
        drawGetReady(context);
        break;
      case initialState.gameOver:
        drawGameOver(context);
        break;
      default:
        break;
    }
    drawScore(context);
  };

  const drawGetReady = (context: CanvasRenderingContext2D) => {
    const getReadyImage = images.current.getReady;
    const tapImage = images.current.tap;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const y = (canvas.height - getReadyImage.height) / 2;
    const x = (canvas.width - getReadyImage.width) / 2;
    const tx = (canvas.width - tapImage[0].width) / 2;
    const ty = y + getReadyImage.height - tapImage[0].height;
    context.drawImage(getReadyImage, x, y);
    context.drawImage(tapImage[uiFrame], tx, ty);
  };

  const drawGameOver = (context: CanvasRenderingContext2D) => {
    const gameOverImage = images.current.gameOver;
    const tapImage = images.current.tap;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const y = (canvas.height - gameOverImage.height) / 2;
    const x = (canvas.width - gameOverImage.width) / 2;
    const tx = (canvas.width - tapImage[0].width) / 2;
    const ty = y + gameOverImage.height - tapImage[0].height;
    context.drawImage(gameOverImage, x, y);
    context.drawImage(tapImage[uiFrame], tx, ty);
  };

  const drawScore = (context: CanvasRenderingContext2D) => {
    context.fillStyle = "#ff99c8";
    context.strokeStyle = "#000000";
    const canvas = canvasRef.current;
    if (!canvas) return;
    switch (state) {
      case initialState.Play:
        context.lineWidth = 2;
        context.font = "30px BubblegumSans";
        context.fillText(`${score}`, canvas.width / 2 - 5, 50);
        context.strokeText(`${score}`, canvas.width / 2 - 5, 50);
        break;
      case initialState.gameOver:
        context.lineWidth = 2;
        context.font = "35px BubblegumSans";
        let sc = `SCORE: ${score}`;
        try {
          const _best = Math.max(
            score,
            Number(localStorage.getItem("best") ?? "0")
          );
          localStorage.setItem("best", `${_best}`);
          let bs = `BEST:   ${_best}`;
          context.fillText(sc, canvas.width / 2 - 80, canvas.height / 2 + 0);
          context.strokeText(sc, canvas.width / 2 - 80, canvas.height / 2 + 0);
          context.fillText(bs, canvas.width / 2 - 80, canvas.height / 2 + 30);
          context.strokeText(bs, canvas.width / 2 - 80, canvas.height / 2 + 30);
        } catch (e) {
          context.fillText(sc, canvas.width / 2 - 85, canvas.height / 2 + 15);
          context.strokeText(sc, canvas.width / 2 - 85, canvas.height / 2 + 15);
        }

        break;
    }
  };

  return (
    <canvas
      className="outline-none rounded-md"
      ref={canvasRef}
      id="canvas"
      width="356"
      height="494"
      onClick={handleGameAction}
      tabIndex={1}
    />
  );
};

export default FlappyCatGame;
