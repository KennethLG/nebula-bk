import Vector from "./vector";

export class Player {
    constructor(
      public id: string,
      public xVel: Vector,
      public yVel: Vector
    ) {}
}

export class PlayerQueue extends Player {
  socketId: string;
}
  