import { Router } from "express";
import { validateSession } from "./middleware";
import { addUser, getUser, getUsers, editUser, login, UserNotFoundError } from "../models/users";
import { addSession, deleteSession, getSessionUser } from "../models/sessions";
import pdf from "pdf-parse"
import { generateEmbedding, getQualifications } from "../agent";
import { sendMail } from "../email";

const userRouter = Router();

userRouter.get("/", validateSession({type: ["admin"]}), async (req, res, next) => {
    const users = await getUsers();
    res.json(users);
});

userRouter.get("/current", validateSession({type: ["applicant"]}), async (req, res, next) => {
    const user = await getUser(req.userId!);
    res.json(user)
})

userRouter.post("/verify", async (req, res, next) => {
    const type = req.body.type;
    try {
        const sessionId = req.cookies.session;
        const user = await getSessionUser(sessionId);
        if(user?.type === type){
            res.sendStatus(200);
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(400);
        next(error);
    }
})

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

userRouter.get("/logout", async (req, res, next) => {
    try {
        const sessionId = req.cookies.session;

        await deleteSession(sessionId);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        next(error);
    }
})

userRouter.post("/signup", async (req, res, next) => {
    try{
        await addUser(req.body);
        await sendMail([req.body.email], "Welcome to smarthire", `
            <html>
            <body>
            <h1>Welcome to SmartHire!</h1>
            <a href="http://localhost:5173/login">Login to your account to confirm your email</a>
            </body>
            </html>
        `)
        res.sendStatus(200);
    }catch(error){
        res.sendStatus(500);
        console.error(error);
        next(error);
    }
})

userRouter.post("/add", validateSession({type: ["admin"]}), async (req, res, next) => {
    try{
        await addUser(req.body);
        res.sendStatus(200);
    }catch(error){
        res.sendStatus(500);
        console.error(error);
        next(error);
    }
})

userRouter.post("/edit", validateSession({type: ["applicant"]}),async (req, res, next) => {
    try {
        const pdfData = await pdf(Buffer.from(req.body.resume, "base64"))
        const qualitifications = await getQualifications(pdfData.text)
        const embeddings = await generateEmbedding(qualitifications.skills.join(", "))

        await editUser({
            ...req.body,
            id: req.userId,
            type: "applicant",
            resumeEmbeddings: embeddings
        });
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
        next(error);
    }
})

export default userRouter;