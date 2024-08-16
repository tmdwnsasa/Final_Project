import express from "express";
import * as webHookController from "./webHookHandler.js";

const webHookRouter = express.Router();

webHookRouter.post("/", webHookController.webHook);

export default webHookRouter;
