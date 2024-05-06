import express from "express";
import { authAdminUser } from "../middlewares/authentication";
import { AdminDashboardUseCases } from "../../useCases/AdminDashboard";
import { RouterAttributes } from "./common/RouterAttributes";
import { RegisterUseCase } from "../../useCases/Register";


const router = express.Router();
router.use(authAdminUser);

router.get("/dashboard/allUsers", AdminDashboardUseCases.dashboard);
router.get("/dashboard/users/:id", AdminDashboardUseCases.getUserById);
router.get("/dashboard/users/:email", AdminDashboardUseCases.getUserByEmail);
router.post("/dashboard/createUser", AdminDashboardUseCases.createUser);
router.post("/createAdmin", AdminDashboardUseCases.createAdmin);
router.post("/dashboard/users/updateEmail/:username", AdminDashboardUseCases.updateEmail);
router.post("/dashboard/users/updatePassword/:identifier", AdminDashboardUseCases.updatePassword);
router.post("/dashboard/users/delete/:id", AdminDashboardUseCases.deleteUser);

export default {
    baseUrl: "/admin",
    router
} as RouterAttributes;