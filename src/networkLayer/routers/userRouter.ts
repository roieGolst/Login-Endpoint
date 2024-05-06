import express from "express";
import { RouterAttributes } from "./common/RouterAttributes";
import { LoginUseCase } from "../../useCases/Login";
import { RegisterUseCase } from "../../useCases/Register";


const router = express.Router();

router.post("/login", LoginUseCase.login);
router.post("/register", RegisterUseCase.register);

export default {
    baseUrl: "/users",
    router
} as RouterAttributes;