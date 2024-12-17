import { Router } from "express";
import { addUser, getUsers, login, UserNotFoundError } from "../models/users";
import { addSession } from "../models/sessions";

const userRouter = Router();

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
        
        res.cookie("session", session);
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

export default userRouter;