import { Request, Response } from "express";
import { DependenciesInjection } from "../di";
import { NewUserPayload } from "../db/entities/user/IUserEntity";

const userRepo = DependenciesInjection.provideUserRepository();

export class AdminDashboardUseCases {

    public static async dashboard(_: Request, res: Response): Promise<void> {
        const userList = await userRepo.getAllUsers();

        res.status(200).json(userList);
    }

    public static async getUserById(req: Request, res: Response): Promise<void> {
        const identifier = req.params.username;

         res.status(200).send(await userRepo.getUserByIdentifier(identifier));
    }
    public static async getUserByEmail(req: Request, res: Response): Promise<void> {
        const identifier = req.params.email;

         res.status(200).send(await userRepo.getUserByIdentifier(identifier));
    }
    public static async createUser(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as NewUserPayload;

            const result = await userRepo.register(body);

            if(!result) {
                res.sendStatus(400);
                return;
            }

            res.sendStatus(200);
        } catch(err) {
            res.sendStatus(400);
        }
    }

    public static async createAdmin(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body as NewUserPayload;

            const result = await userRepo.registerAdminUser(body);

            if(!result) {
                res.sendStatus(400);
                return;
            }

            res.sendStatus(200);
        } catch(err) {
            res.sendStatus(400);
        }
    }

    public static async updateEmail(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;

            const result = await userRepo.updateEmail(body.username, body.requestedEmail);

            if(!result) {
                res.sendStatus(400);
                return;
            }

            res.sendStatus(200);
        } catch(err) {
            res.sendStatus(400);
        }
    }

    public static async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;

            const result = await userRepo.updatePassword(body.identifire, body.newPassword);

            if(!result) {
                res.sendStatus(400);
                return;
            }

            res.sendStatus(200);
        } catch(err) {
            res.sendStatus(400);
        }
    }

    public static async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const body = req.body;

            const result = await userRepo.deleteUser(body.id);

            if(!result) {
                res.sendStatus(400);
                return;
            }

            res.sendStatus(200);
        } catch(err) {
            res.sendStatus(400);
        }
    }
}