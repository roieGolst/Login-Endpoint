import express, { Express } from "express";
import * as fs from "fs";
import { RouterAttributes } from "./routers/common/RouterAttributes";
import { network } from "../configs";
import userRote from "./routers/userRouter";

export class NetworkLayer {
    private static INSTANCE: NetworkLayer;
    private app: Express;

    private constructor() {
    }
    public static getInstance(): NetworkLayer {
        if(!NetworkLayer.INSTANCE) {
            NetworkLayer.INSTANCE = new NetworkLayer();
        }

        return NetworkLayer.INSTANCE;
    }

    public async init(): Promise<void> {
        this.app = express()
        this.app.use(express.json());
        await this.setRouters("./src/networkLayer/routers");
    }

    private async setRouters(routersPath: string): Promise<void> {
        try {
            const routeFiles = fs.readdirSync(routersPath);

            for (let route of routeFiles) {
                if (route == "common") continue;

                route = route.split(".")[0];

                let routeModule = await import(`./routers/${route}`);
                routeModule = routeModule.default as RouterAttributes;
                this.app.use(routeModule.baseUrl, routeModule.router);
            }
        } catch (err: unknown) {
            console.error(err);
            throw new Error();
        }
    }

    public listen(cb: () => void) {
        this.app.listen(network.port, cb);
    }
}

export { RouterAttributes } from "./routers/common/RouterAttributes";