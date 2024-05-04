import { bootstrap } from "./bootstrap";
import DBInstance from "./db";

bootstrap({dbInitializer: DBInstance.init})
    .then(() => {
        console.log("yesss");
    });
