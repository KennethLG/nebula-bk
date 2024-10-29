import Vector from "./vector";

type Dead = boolean;

interface PlayerOptions {
  xVel?: Vector;
  yVel?: Vector;
  position?: Vector;
  key?: string;
  keyState?: boolean;
  dead?: Dead;
}

export class Player {
  public id: string;
  public xVel: Vector;
  public yVel: Vector;
  public position: Vector;
  public key: string;
  public keyState: boolean;
  public dead: Dead;

  constructor(id: string, {
    xVel = new Vector(),
    yVel = new Vector(),
    position = new Vector(),
    key = '',
    keyState = false,
    dead = false,
  }: PlayerOptions = {}) {
    this.id = id;
    this.xVel = xVel;
    this.yVel = yVel;
    this.position = position;
    this.key = key;
    this.keyState = keyState;
    this.dead = dead;
  }
}
export const playerFactory = (id: string, options?: PlayerOptions) => {
  return new Player(id, options);
}

interface PlayerQueueOptions extends PlayerOptions {
  socketId: string;
}

export class PlayerQueue extends Player {
  public socketId: string;

  constructor(id: string, { socketId, ...playerOptions }: PlayerQueueOptions) {
    super(id, playerOptions);
    this.socketId = socketId;
  }
}

export const playerQueueFactory = (id: string, socketId: string, options?: PlayerOptions) => {
  return new PlayerQueue(id, { socketId, ...options });
};