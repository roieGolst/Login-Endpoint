import { Request, Response } from "express";
import { DependenciesInjection } from "../di";
import { UserAttributes } from "../db/entities/user/IUserEntity";

export class AdminDashboardUseCases {

    public static async dashboard(req: Request, res: Response): Promise<void> {
        const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
        const userList = await usrRepo.getAllUsers();

        res.status(200).json(userList);
    }

    public static async getUserById(req: Request, res: Response): Promise<void> {
        const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
        const identifier = req.params.username;

         res.status(200).send(await usrRepo.getUser(identifier));
    }
    public static async getUserByEmail(req: Request, res: Response): Promise<void> {
        const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
        const identifier = req.params.email;

         res.status(200).send(await usrRepo.getUser(identifier));
    }
    public static async createUser(req: Request, res: Response): Promise<void> {
        try {
            const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
            const body = req.body as UserAttributes;

            const result = await usrRepo.register(body);

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
            const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
            const body = req.body as UserAttributes;

            const result = await usrRepo.registerAdminUser(body);

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
            const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
            const body = req.body;

            const result = await usrRepo.updateEmail(body.username, body.requestedEmail);

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
            const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
            const body = req.body;

            const result = await usrRepo.updatePassword(body.identifire, body.newPassword);

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
            const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
            const body = req.body;

            const result = await usrRepo.deleteUser(body.id);

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