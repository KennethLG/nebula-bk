import { UserGrpcClient } from "../../infrastructure/grpc/userGrpcClient";
import { ConflictError } from "../../infrastructure/httpError";

type SignupUseCaseDto = {
  email: string;
  username: string;
  password: string;
};

export class SignupUseCase {
  constructor(private readonly userGrpcClient: UserGrpcClient) {}
  async execute(signupUseCaseDto: SignupUseCaseDto) {
    try {
      await this.userGrpcClient.createUser(signupUseCaseDto);
    } catch (err: any) {
      if (err.message === "User already exists") {
        throw new ConflictError("User already exists");
      } else {
        throw err;
      }
    }
  }
}
