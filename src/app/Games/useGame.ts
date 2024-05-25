import { useCallback, useEffect, useState } from "react";
import {
  Bird,
  GameBg,
  GameGround,
  GamePipe,
  GameUI,
  GameSFX,
  GameState,
  Game,
} from "./type";
import Ground from "@/assets/images/flappy/ground.png";
import Background from "@/assets/images/flappy/BG.png";
import TopPipe from "@/assets/images/flappy/toppipe.png";
import BotPipe from "@/assets/images/flappy/botpipe.png";
import Go from "@/assets/images/flappy/go.png";
import GetReady from "@/assets/images/flappy/getready.png";
import T0 from "@/assets/images/flappy/tap/t0.png";
import T1 from "@/assets/images/flappy/tap/t1.png";
import B0 from "@/assets/images/flappy/bird/b0.png";
import B1 from "@/assets/images/flappy/bird/b1.png";
import B2 from "@/assets/images/flappy/bird/b2.png";

interface Props {
  canvas: HTMLCanvasElement | null;
}

export default function useGame({ canvas }: Props) {
  const [gameState, setGameState] = useState<Game | null>(null);
  const [frames, setFrames] = useState(0);
  const [dx, setDx] = useState(2);

  const initState = useCallback(() => {
    const RAD = Math.PI / 180;
    const scrn = canvas;
    if (!scrn) return;
    const sctx = scrn.getContext("2d");
    if (!sctx) return;
    scrn.tabIndex = 1;

    const state: GameState = {
      curr: 0,
      getReady: 0,
      Play: 1,
      gameOver: 2,
    };
    const SFX: GameSFX = {
      start: new Audio(),
      flap: new Audio(),
      score: new Audio(),
      hit: new Audio(),
      die: new Audio(),
      played: false,
    };
    const gnd: GameGround = {
      sprite: new Image(),
      x: 0,
      y: 0,
      draw: function () {
        this.y = scrn.height - this.sprite.height;
        sctx.drawImage(this.sprite, this.x, this.y);
      },
      update: function () {
        if (state.curr != state.Play) return;
        this.x -= dx;
        this.x = this.x % (this.sprite.width / 2);
      },
    };
    const bg: GameBg = {
      sprite: new Image(),
      x: 0,
      y: 0,
      draw: function () {
        this.y = scrn.height - this.sprite.height;
        sctx.drawImage(this.sprite, this.x, this.y);
      },
    };
    const pipe: GamePipe = {
      top: { sprite: new Image() },
      bot: { sprite: new Image() },
      gap: 85,
      moved: true,
      pipes: [],
      draw: function () {
        for (let i = 0; i < this.pipes.length; i++) {
          let p = this.pipes[i];
          sctx.drawImage(this.top.sprite, p.x, p.y);
          sctx.drawImage(
            this.bot.sprite,
            p.x,
            p.y + this.top.sprite.height + this.gap
          );
        }
      },
      update: function () {
        if (state.curr != state.Play) return;
        if (frames % 100 == 0) {
          this.pipes.push({
            x: scrn.width,
            y: -210 * Math.min(Math.random() + 1, 1.8),
          });
        }
        this.pipes.forEach((pipe) => {
          pipe.x -= dx;
        });

        if (this.pipes.length && this.pipes[0].x < -this.top.sprite.width) {
          this.pipes.shift();
          this.moved = true;
        }
      },
    };
    const bird: Bird = {
      animations: [
        { sprite: new Image() },
        { sprite: new Image() },
        { sprite: new Image() },
        { sprite: new Image() },
      ],
      rotatation: 0,
      x: 50,
      y: 100,
      speed: 0,
      gravity: 0.125,
      thrust: 3.6,
      frame: 0,
      draw: function () {
        let h = this.animations[this.frame].sprite.height;
        let w = this.animations[this.frame].sprite.width;
        sctx.save();
        sctx.translate(this.x, this.y);
        sctx.rotate(this.rotatation * RAD);
        sctx.drawImage(this.animations[this.frame].sprite, -w / 2, -h / 2);
        sctx.restore();
      },
      update: function () {
        let r = this.animations[0].sprite.width / 2;
        switch (state.curr) {
          case state.getReady:
            this.rotatation = 0;
            this.y += frames % 10 == 0 ? Math.sin(frames * RAD) : 0;
            this.frame += frames % 10 == 0 ? 1 : 0;
            break;
          case state.Play:
            this.frame += frames % 5 == 0 ? 1 : 0;
            this.y += this.speed;
            this.setRotation();
            this.speed += this.gravity;
            if (this.y + r >= gnd.y || this.collisioned()) {
              state.curr = state.gameOver;
            }

            break;
          case state.gameOver:
            this.frame = 1;
            if (this.y + r < gnd.y) {
              this.y += this.speed;
              this.setRotation();
              this.speed += this.gravity * 2;
            } else {
              this.speed = 0;
              this.y = gnd.y - r;
              this.rotatation = 90;
              if (!SFX.played) {
                SFX.die.play();
                SFX.played = true;
              }
            }

            break;
        }
        this.frame = this.frame % this.animations.length;
      },
      flap: function () {
        if (this.y > 0) {
          SFX.flap.play();
          this.speed = -this.thrust;
        }
      },
      setRotation: function () {
        if (this.speed <= 0) {
          this.rotatation = Math.max(
            -25,
            (-25 * this.speed) / (-1 * this.thrust)
          );
        } else if (this.speed > 0) {
          this.rotatation = Math.min(90, (90 * this.speed) / (this.thrust * 2));
        }
      },
      collisioned: function () {
        if (!pipe.pipes.length) return false;
        let bird = this.animations[0].sprite;
        let x = pipe.pipes[0].x;
        let y = pipe.pipes[0].y;
        let r = bird.height / 4 + bird.width / 4;
        let roof = y + pipe.top.sprite.height;
        let floor = roof + pipe.gap;
        let w = pipe.top.sprite.width;
        if (this.x + r >= x) {
          if (this.x + r < x + w) {
            if (this.y - r <= roof || this.y + r >= floor) {
              SFX.hit.play();
              return true;
            }
          } else if (pipe.moved) {
            UI.score.curr++;
            SFX.score.play();
            pipe.moved = false;
          }
        }
        return false;
      },
    };
    const UI: GameUI = {
      getReady: { sprite: new Image() },
      gameOver: { sprite: new Image() },
      tap: [{ sprite: new Image() }, { sprite: new Image() }],
      score: {
        curr: 0,
        best: 0,
      },
      x: 0,
      y: 0,
      tx: 0,
      ty: 0,
      frame: 0,
      draw: function () {
        switch (state.curr) {
          case state.getReady:
            this.y = (scrn.height - this.getReady.sprite.height) / 2;
            this.x = (scrn.width - this.getReady.sprite.width) / 2;
            this.tx = (scrn.width - this.tap[0].sprite.width) / 2;
            this.ty =
              this.y + this.getReady.sprite.height - this.tap[0].sprite.height;
            sctx.drawImage(this.getReady.sprite, this.x, this.y);
            sctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
            break;
          case state.gameOver:
            this.y = (scrn.height - this.gameOver.sprite.height) / 2;
            this.x = (scrn.width - this.gameOver.sprite.width) / 2;
            this.tx = (scrn.width - this.tap[0].sprite.width) / 2;
            this.ty =
              this.y + this.gameOver.sprite.height - this.tap[0].sprite.height;
            sctx.drawImage(this.gameOver.sprite, this.x, this.y);
            sctx.drawImage(this.tap[this.frame].sprite, this.tx, this.ty);
            break;
        }
        this.drawScore();
      },
      drawScore: function () {
        sctx.fillStyle = "#FFFFFF";
        sctx.strokeStyle = "#000000";
        switch (state.curr) {
          case state.Play:
            sctx.lineWidth = 2;
            sctx.font = "35px Squada One";
            sctx.fillText(`${this.score.curr}`, scrn.width / 2 - 5, 50);
            sctx.strokeText(`${this.score.curr}`, scrn.width / 2 - 5, 50);
            break;
          case state.gameOver:
            sctx.lineWidth = 2;
            sctx.font = "40px Squada One";
            let sc = `SCORE :     ${this.score.curr}`;
            try {
              this.score.best = Math.max(
                this.score.curr,
                Number(localStorage.getItem("best") ?? "0")
              );
              localStorage.setItem("best", `${this.score.best}`);
              let bs = `BEST  :     ${this.score.best}`;
              sctx.fillText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
              sctx.strokeText(sc, scrn.width / 2 - 80, scrn.height / 2 + 0);
              sctx.fillText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
              sctx.strokeText(bs, scrn.width / 2 - 80, scrn.height / 2 + 30);
            } catch (e) {
              sctx.fillText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
              sctx.strokeText(sc, scrn.width / 2 - 85, scrn.height / 2 + 15);
            }

            break;
        }
      },
      update: function () {
        if (state.curr == state.Play) return;
        this.frame += frames % 10 == 0 ? 1 : 0;
        this.frame = this.frame % this.tap.length;
      },
    };

    gnd.sprite.src = Ground.src;
    bg.sprite.src = Background.src;
    pipe.top.sprite.src = TopPipe.src;
    pipe.bot.sprite.src = BotPipe.src;
    UI.gameOver.sprite.src = Go.src;
    UI.getReady.sprite.src = GetReady.src;
    UI.tap[0].sprite.src = T0.src;
    UI.tap[1].sprite.src = T1.src;
    bird.animations[0].sprite.src = B0.src;
    bird.animations[1].sprite.src = B1.src;
    bird.animations[2].sprite.src = B2.src;
    bird.animations[3].sprite.src = B0.src;
    SFX.start.src = "/sfx/start.wav";
    SFX.flap.src = "/sfx/flap.wav";
    SFX.score.src = "/sfx/score.wav";
    SFX.hit.src = "/sfx/hit.wav";
    SFX.die.src = "/sfx/die.wav";

    scrn.addEventListener("click", () => {
      switch (state.curr) {
        case state.getReady:
          state.curr = state.Play;
          SFX.start.play();
          break;
        case state.Play:
          bird.flap();
          break;
        case state.gameOver:
          state.curr = state.getReady;
          bird.speed = 0;
          bird.y = 100;
          pipe.pipes = [];
          UI.score.curr = 0;
          SFX.played = false;
          break;
      }
    });

    scrn.onkeydown = function keyDown(e) {
      if (e.code == "Space" || e.code == "KeyW" || e.code == "ArrowUp") {
        // Space Key or W key or arrow up
        switch (state.curr) {
          case state.getReady:
            state.curr = state.Play;
            SFX.start.play();
            break;
          case state.Play:
            bird.flap();
            break;
          case state.gameOver:
            state.curr = state.getReady;
            bird.speed = 0;
            bird.y = 100;
            pipe.pipes = [];
            UI.score.curr = 0;
            SFX.played = false;
            break;
        }
      }
    };

    setGameState({
      gnd,
      bg,
      pipe,
      UI,
      bird,
      SFX,
      state,
    });
  }, [canvas, dx, frames]);

  useEffect(() => {
    initState();
    return () => {
      setGameState(null);
    };
  }, [initState]);

  function gameLoop() {
    update();
    draw();
    setFrames(frames + 1);
  }

  function update() {
    if (gameState) {
      gameState.bird.update();
      gameState.gnd.update();
      gameState.pipe.update();
      gameState.UI.update();
    }
  }

  function draw() {
    if (!gameState) return;
    const scrn = canvas;
    if (!scrn) return;
    const sctx = scrn.getContext("2d");
    if (!sctx) return;
    sctx.fillStyle = "#30c0df";
    sctx.fillRect(0, 0, scrn.width, scrn.height);
    gameState.bg.draw();
    gameState.pipe.draw();
    gameState.bird.draw();
    gameState.gnd.draw();
    gameState.UI.draw();
  }

  return {
    state: gameState,
    gameLoop,
  };
}
