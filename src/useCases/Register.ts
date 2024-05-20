import { Request, Response } from "express";
import { DependenciesInjection } from "../di";
import { NewUserPayload } from "../db/entities/user/IUserEntity";

export class RegisterUseCase {

    public static async register(req: Request, res: Response): Promise<void> {
        try {
            const usrRepo = DependenciesInjection.provideUserRepository();
            const body = req.body as NewUserPayload;

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