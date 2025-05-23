import express, { Express } from "express";
import swaggerUI from "swagger-ui-express";
import cors from "cors";
import yaml from "yamljs";
import { getConfig } from "./config";
import lists from "./routes/lists";
import items from "./routes/items";
import { configureMongoose } from "./models/mongoose";
import { observability } from "./config/observability";


const allowOrigins = process.env.API_ALLOW_ORIGINS;


const environment = "development"; 

const originList = ():string[]|string => {
    
    if (environment && environment === "development") {
        console.log(`Allowing requests from any origins. NODE_ENV=${environment}`);
        return "*";
    }
    
    const origins = [
        "https://portal.azure.com",
        "https://ms.portal.azure.com",
    ];

    if (allowOrigins && allowOrigins !== "") {
        allowOrigins.split(",").forEach(origin => {
            origins.push(origin);
        });
    }

    return origins;
};

export const createApp = async (): Promise<Express> => {
    const config = await getConfig();
    const app = express();

    // Configuration
    observability(config.observability);
    await configureMongoose(config.database);
    // Middleware
    app.use(express.json());
    
    app.use(cors({
        origin: originList()
    }));

    // API Routes
    app.use("/lists/:listId/items", items);
    app.use("/lists", lists);

    // Swagger UI
    const swaggerDocument = yaml.load("./openapi.yaml");
    app.use("/", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

    return app;
};
