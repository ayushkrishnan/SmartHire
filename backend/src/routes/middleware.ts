import { getSessionUser } from "../models/sessions";
import {  NextFunction, Request, Response } from "express";

export function validateSession({type}: {type: string[]}){
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionId = req.cookies.session;
            const user = await getSessionUser(sessionId);
            if(type.includes(user?.type!)){
                req.userId = user?.id!;
                next();
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(400);
            next(error);
        }
    }
}