import { Router } from "express";
import { LoginUseCase } from "../../application/usecases/loginUseCase";
import { SignupUseCase } from "../../application/usecases/signupUseCase";

class HttpRouter {
  private readonly router;

  constructor (
    private readonly loginUseCase: LoginUseCase,
    private readonly signupUseCase: SignupUseCase
  ) {
    this.router = Router();
    this.registerRoutes()
  }

  private registerRoutes() {

    this.router.post('/login', async (req, res, next) => {
      const { email, password } = req.body;
      try {

        const result = await this.loginUseCase.execute({
          email,
          password
        });

        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    })

    this.router.post('/signup', async (req, res, next) => {
      const { email, username, password } = req.body;
      try {
        const result = await this.signupUseCase.execute({
          email,
          username,
          password
        });

        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    })
  }
  
  getRouter() {
    return this.router;
  }
}

export default HttpRouter;
