import { Request, Response } from "express";
import { DependenciesInjection } from "../../di";
import { UserAttributes } from "../../db/entities/user/IUserEntity";

export class RegisterUseCase {

    public static async register(req: Request, res: Response): Promise<void> {
        try {
            const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
            const token = req.header("access-token");
            const body = req.body as UserAttributes;

            if(!token && !body.adminUser) {
                await usrRepo.register(body);
                res.sendStatus(200);
                return;
            }

            if(body.adminUser && token) {
                await usrRepo.registerAdminUser(body, token);
                res.sendStatus(200);
                return;
            }
        } catch (err) {
            res.sendStatus(400);
        }
    }
}