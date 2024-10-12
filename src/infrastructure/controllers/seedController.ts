import { Request, Response } from "express";
import { GenerateSeed } from "../../core/usecases/generateSeed";

export class SeedController {
    constructor(
        private readonly generateSeed: GenerateSeed
    ) {}

    getSeed(req: Request, res: Response) {
        try {
            const seed = this.generateSeed.execute();
            res.status(200).json({
                data: {
                    seed
                },
                message: 'Seed generated successfully'
            })
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Error generating seed'
            })
        }
    }
}