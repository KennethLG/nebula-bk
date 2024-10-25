import Vector from "./vector";

export class Player {
    constructor(
      public id: number,
      public xVel: Vector,
      public yVel: Vector
    ) {}
}

export class PlayerQueue extends Player {
  socketId: string;
}
  