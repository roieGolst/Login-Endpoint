import { Request, Response } from "express";
import { DependenciesInjection } from "../../di";
import UserModel from "../../db/entities/user/model/UserModel";
import bcrypt from "bcrypt";
import { Tokens } from "../../utils/tokens/common/types";

export class LoginUseCase {

    public static async login(req: Request, res: Response): Promise<void> {
        const usrRepo = await DependenciesInjection.getUserRepositoryInstance();

        const user = await usrRepo.isSafaLogin(req.body.identifier);
        const tokens = await this.authenticateUser(user, req);

        res.cookie("refresh-token", tokens.refreshToken);
        res.status(200).json({token: tokens.token});
    }

    public static async authenticateUser(user: UserModel, req: Request): Promise<Tokens> {
        const isValidPassword = await bcrypt.compare(user.password, req.body.password);

        if(!isValidPassword) {
            throw new Error("Invalid password");
        }

        return (await DependenciesInjection.getTokenRepositoryInstance())
            .generateTokens({
                username: user.username,
                id: user.id
            });
    }
}