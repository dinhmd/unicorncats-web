export type Game = {
  gnd: GameGround;
  bg: GameBg;
  pipe: GamePipe;
  UI: GameUI;
  bird: Bird;
  SFX: GameSFX;
  state: GameState;
};

export type Pipe = {
  x: number;
  y: number;
};

export type Sprite = {
  sprite: HTMLImageElement;
};
export type GamePipe = {
  top: Sprite;
  bot: Sprite;
  gap: number;
  moved: boolean;
  pipes: Pipe[];
  draw: () => void;
  update: () => void;
};

export type GameBg = {
  sprite: HTMLImageElement;
  x: number;
  y: number;
  draw: () => void;
};

export type GameGround = {
  sprite: HTMLImageElement;
  x: number;
  y: number;
  draw: () => void;
  update: () => void;
};

export type Bird = {
  animations: {
    sprite: HTMLImageElement;
  }[];
  rotatation: number;
  x: number;
  y: number;
  speed: number;
  gravity: number;
  thrust: number;
  frame: number;
  draw: () => void;
  update: () => void;
  flap: () => void;
  setRotation: () => void;
  collisioned: () => boolean;
};

export type GameUI = {
  getReady: Sprite;
  gameOver: Sprite;
  tap: Sprite[];
  score: {
    curr: number;
    best: number;
  };
  x: number;
  y: number;
  tx: number;
  ty: number;
  frame: number;
  draw: () => void;
  drawScore: () => void;
  update: () => void;
};

export type GameSFX = {
  start: HTMLAudioElement;
  flap: HTMLAudioElement;
  score: HTMLAudioElement;
  hit: HTMLAudioElement;
  die: HTMLAudioElement;
  played: boolean;
};

export type GameState = {
  curr: number;
  getReady: number;
  Play: number;
  gameOver: number;
};
