import { Request, Response, NextFunction } from "express";
import { DependenciesInjection } from "../../di";

export async function authAdminUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.header("access-token");
    const tokenRepo = await DependenciesInjection.getTokenRepositoryInstance();

    if(!token) {
        res.redirect(400, "/users/login");
        return;
    }

    const userSign = tokenRepo.authToken(token);

    if(!userSign) {
        res.sendStatus(403);
        return;
    }

    const userRepository = await DependenciesInjection.getUserRepositoryInstance();

    if(! await userRepository.isAdmin(userSign.id)) {
        res.redirect(401, "login");
        return;
    }

    next();
}