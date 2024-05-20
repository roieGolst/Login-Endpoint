import { bootstrap } from "./bootstrap";
import DbHelper from "./db";

bootstrap({dbInitializer: DbHelper.init})
    .then(() => {
        console.log("yesss");
    });
