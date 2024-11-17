import { IUsersRepo } from "../../domain/interfaces/IUsersRepo";
import { UserGrpcClient } from "../grpc/userGrpcClient";

export class UsersRepo implements IUsersRepo {
  private readonly grpcClient: UserGrpcClient;

  constructor() {
    this.grpcClient = new UserGrpcClient();
  }

  async getUser(id: string) {
    const user = await this.grpcClient.getUser(id);
    return user;
  }

  async createUser(createUserDto: any) {
    await this.grpcClient.createUser(createUserDto);
  }
}
