import Vector from "./vector";

export class Player {
    constructor(
      public id: string,
      public xVel: Vector,
      public yVel: Vector,
      public position: Vector,
      public key: string,
      public keyState: boolean
    ) {}
}

export class PlayerQueue extends Player {
  socketId: string;
}
    