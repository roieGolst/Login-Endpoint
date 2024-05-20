import bcrypt from "bcrypt";
import { IUseCase } from "./IUseCase";
import { User } from "../utils/users/IUserRepository";

export class UserAuthenticationUseCase implements IUseCase<boolean> {

    private readonly user: User;
    private readonly reqPass: string;
    constructor(user: User, reqPass: string) {
        this.user = user;
        this.reqPass = reqPass;
    }

    public perform(): boolean {
        return bcrypt.compareSync(this.reqPass, this.user.password);
    }

    // public static async login(req: Request, res: Response): Promise<void> {
    //     try {
    //             const usrRepo = await DependenciesInjection.getUserRepositoryInstance();
    //
    //         const user = await usrRepo.isSafaLogin(req.body.identifier);
    //         const tokens = await LoginUseCase.authenticateUser(user, req);
    //
    //         res.cookie("refresh-token", tokens.refreshToken);
    //         res.status(200).json({token: tokens.token});
    //
    //     } catch (err) {
    //         res.status(401).send(err);
    //         return;
    //     }
    // }
    //
    // private static async authenticateUser(user: UserModel, req: Request): Promise<Tokens> {
    //     const isValidPassword = await bcrypt.compare(req.body.password, user.password);
    //
    //     if(!isValidPassword) {
    //         throw new Error("Invalid password");
    //     }
    //
    //     return (await DependenciesInjection.getTokenRepositoryInstance())
    //         .generateTokens({
    //             username: user.username,
    //             id: user.id
    //         });
    // }
}