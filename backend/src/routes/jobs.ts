import { Router } from "express";
import { validateSession } from "./middleware";
import { addJob, getJobs, getJob, deleteJob } from "../models/jobs";

const jobRouter = Router();

jobRouter.use(validateSession({type: ["hr", "admin", "applicant"]}));

jobRouter.get("/", async (req, res, next) => {
    const userId = req.userId;

    if(!userId){
        res.sendStatus(403);
    }

    try {
        const jobs = await getJobs(userId!);
        res.json(jobs);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        next(error);
    }
})

jobRouter.get("/:id", async (req, res, next) => {
    try {
        const job = await getJob(Number(req.params.id));

        res.json(job);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        next(error);
    }
})

jobRouter.delete("/:id", async (req, res, next) => {
    try {
        await deleteJob(Number(req.params.id));
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        next(error);
    }
});

jobRouter.post("/", async (req, res, next) => {
    const {skills, title, description, department, experience} = req.body;

    try {
        const job = await addJob({
            title,
            description,
            department,
            experience,
            userId: req.userId!
        }, skills)
        res.json(job);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        next(error);
    }
})

export default jobRouter;