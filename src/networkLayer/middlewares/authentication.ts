import { Request, Response, NextFunction } from "express";
import { DependenciesInjection } from "../../di";

const tokenRepo = DependenciesInjection.provideTokenRepository();
const userRepo = DependenciesInjection.provideUserRepository();

export async function authAdminUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.header("access-token");

    if(!token) {
        res.redirect(400, "/users/login");
        return;
    }

    const userSign = tokenRepo.authToken(token);

    if(!userSign) {
        res.sendStatus(403);
        return;
    }

    const queriedUser = await userRepo.getUserById(userSign.id);

    if(!queriedUser) {
        res.sendStatus(401);
        return;
    }

    if(! await userRepo.isAdmin(queriedUser)) {
        res.redirect(401, "login");
        return;
    }

    next();
}