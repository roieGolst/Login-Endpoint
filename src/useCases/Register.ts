import { Request, Response } from "express";
import { DependenciesInjection } from "../di";
import { UserAttributes } from "../db/entities/user/IUserEntity";

export class RegisterUseCase {

    public static async register(req: Request, res: Response): Promise<void> {
        try {
            const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
            const body = req.body as UserAttributes;

            const result = await usrRepo.register(body);

            if (!result) {
                res.sendStatus(400);
                return;
            }

            res.sendStatus(200);

        } catch (err) {
            res.sendStatus(400);
        }
    }
}