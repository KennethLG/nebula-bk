import { config } from "../../config";
import jwt from 'jsonwebtoken';

export class TokenService {
  private readonly secretKey = config.JWT_TOKEN;

  generateToken(payload: object): string {
    return jwt.sign(payload, this.secretKey, {
      expiresIn: '1h'
    });
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.secretKey);
  }
}
