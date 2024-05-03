import { bootstrap } from "./bootstrap";
import DBInstance from "./db";
import UserModel from "./db/entities/user/model/UserModel";
import UserSequelizeEntity from "./db/entities/user/User";

bootstrap({dbInitializer: DBInstance.init})
    .then(() => {
        console.log("yesss");
    });
