import { Router } from "express";
import { SeedController } from "../controllers/seedController";
import { GenerateSeed } from "../../core/usecases/generateSeed";

const router = Router();
const seedController = new SeedController(new GenerateSeed());

router.get('/seed', (req, res) => seedController.getSeed(req, res));

export default router;