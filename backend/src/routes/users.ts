import { NextFunction, Request, Response,  Router } from "express";
import { addUser, getUsers, login, UserNotFoundError } from "../models/users";
import { addSession, getSessionUser } from "../models/sessions";

const userRouter = Router();

function validateSession({type}: {type: string}){
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const sessionId = req.cookies.session;
            const user = await getSessionUser(sessionId);
            if(user?.type === type){
                next();
            }
        } catch (error) {
            console.error(error);
            res.sendStatus(400);
            next(error);
        }
    }
}

userRouter.get("/", validateSession({type: "admin"}), async (req, res, next) => {
    const users = await getUsers();
    res.json(users);
});

// API route to initiate setup screen when there are no admins
userRouter.get("/count", async (req, res, next) => {
    const users = await getUsers();
    res.json({
        count: users.length
    })
})

userRouter.post("/login", async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await login(email, password);
        const session = await addSession(user?.id!);
        
        res.cookie("session", session.at(0)?.id!).json(user);
    } catch (error) {
        if(error instanceof UserNotFoundError){
            res.sendStatus(400);
        }else{
            res.sendStatus(500);
        }
        console.error(error);
        next(error);
    }
})

userRouter.post("/signup", async (req, res, next) => {
    try{
        await addUser(req.body);
        res.sendStatus(200);
    }catch(error){
        res.sendStatus(500);
        console.error(error);
        next(error);
    }
})

userRouter.post("/add", validateSession({type: "admin"}), async (req, res, next) => {
    
})

export default userRouter;