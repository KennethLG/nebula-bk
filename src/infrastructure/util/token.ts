import { verify } from "jsonwebtoken"
import { config } from "../../config"

export const validateToken = (token: any) => {
  const data = verify(token, config.JWT_TOKEN);
  return data;
}
