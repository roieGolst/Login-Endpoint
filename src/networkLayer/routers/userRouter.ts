import express, { Request, Response } from "express";
import { RouterAttributes } from "./common/RouterAttributes";
import { RegisterUseCase } from "../../useCases/Register";
import { DependenciesInjection } from "../../di";
import { IUserRepository, User } from "../../utils/users/IUserRepository";
import { UserAuthenticationUseCase } from "../../useCases/Login";
import { ITokenRepository } from "../../utils/tokens/ITokenRepository";
import { Tokens } from "../../utils/tokens/common/types";


const router = express.Router();
const userRepo: IUserRepository = DependenciesInjection.provideUserRepository();
const tokenRepo: ITokenRepository = DependenciesInjection.provideTokenRepository();

//TODO: Look for away to inject validation to the handlers.
router.post("/login",  async (req: Request, res: Response): Promise<void> => {
    const body = req.body;

    const user: User | null = await userRepo.getUserByIdentifier(body.identifier);

    if(!user) {
        res.status(401).send("Email or username incorrect");
        return;
    }

    if(! (await userRepo.isNotLoggedIn(user))) {
        res.status(405).send("Email or username incorrect");
        return
    }

    const userAuthUseCase = new UserAuthenticationUseCase(user, body.password);

    if(!userAuthUseCase.perform()) {
        res.status(401).send("Incorrect password");
        return
    }

    const tokens: Tokens = await tokenRepo.generateTokens({id: user.id, username: user.username});

    res.cookie("refresh-token", tokens.refreshToken);
    res.status(200).json({token: tokens.token});
});

router.post("/register", RegisterUseCase.register);

export default {
    baseUrl: "/users",
    router
} as RouterAttributes;