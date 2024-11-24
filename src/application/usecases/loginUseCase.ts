import { UserGrpcClient } from "../../infrastructure/grpc/userGrpcClient";
import { InvalidCredentialsError, NotFoundError } from "../../infrastructure/httpError";
import { TokenService } from "../services/tokenService";

type LoginUseCaseDto = {
  email: string;
  password: string;
} 

export class LoginUseCase {
  constructor(
    private readonly userGrpcClient: UserGrpcClient,
    private readonly tokenService: TokenService
  ) {}
  async execute(loginUseCaseDto: LoginUseCaseDto) {
    const user = await this.userGrpcClient.getUserByEmail({ email: loginUseCaseDto.email });
    console.log(`user found: ${JSON.stringify(user)}`);
    if (!user) {
      throw new NotFoundError('User does not exist'); 
    }
    console.log(`check password: ${user.password} === ${loginUseCaseDto.password}`);
    if (user.password !== loginUseCaseDto.password) {
      throw new InvalidCredentialsError(); 
    }
    const token = this.tokenService.generateToken(user);
    return token;
  }
}
