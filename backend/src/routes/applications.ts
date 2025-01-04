import { Router } from "express";
import { validateSession } from "./middleware";
import { getApplications, getApplication, addApplication, getJobApplications, setApplicationStatus } from "../models/applications";
import { gradeResume } from "../agent";
import { getJob } from "../models/jobs";
import { btoa } from "node:buffer";
import pdf from "pdf-parse"
import { getUser } from "../models/users";

const applicationRouter = Router();

applicationRouter.use(validateSession({
    type: ["hr", "applicant"]
}))

applicationRouter.get("/", async (req, res, next) => {
    const user = req.userId;

    try {
        const applications = await getApplications(user!)
        res.json(applications);
    } catch (error) {
        console.error(error)
        res.send(500)
        next(error)
    }
})

applicationRouter.get("/job/:id", async (req, res, next) => {

    try {
        const applications = await getJobApplications(Number(req.params.id))
        res.json(applications);
    } catch (error) {
        console.error(error)
        res.send(500)
        next(error)
    }
})

applicationRouter.get("/:id", async (req, res, next) => {
    try {
        const application = getApplication(Number(req.params.id))
        res.json(application);
    } catch (error) {
        console.error(error)
        res.send(500)
        next(error)
    }
})

applicationRouter.post("/suggestions", async (req, res, next) => {
    try {
        const userId = req.userId;
        const {jobId} = req.body;

        const job = await getJob(jobId);
        const user = await getUser(userId!);

        const pdfData = await pdf(Buffer.from(user?.resume!, "base64"))

        const analysis = await gradeResume(pdfData.text, job.title, job.description, job.experience!)
        console.log(analysis)

        res.json(analysis)
    } catch (error) {
        console.error(error)
        res.send(500)
        next(error)
    }
})

applicationRouter.post("/status/:id", async (req, res, next) => {
    try {
        setApplicationStatus(Number(req.params.id), req.body.status);
        res.sendStatus(200);
    } catch (error) {
        console.error(error)
        res.send(500)
        next(error)
    }
})

applicationRouter.post("/", async (req, res, next) => {
    try {
        const userId = req.userId;
        const {jobId} = req.body;

        const job = await getJob(jobId);
        const user = await getUser(userId!);

        const pdfData = await pdf(Buffer.from(user?.resume!, "base64"))

        const analysis = await gradeResume(pdfData.text, job.title, job.description, job.experience!)
        console.log(analysis)

        await addApplication({
            userId,
            jobId,
            score: analysis.score,
            suggestions: analysis.suggestions
        })

        res.sendStatus(200);
    } catch (error) {
        console.error(error)
        res.send(500)
        next(error)
    }
})

export default applicationRouter;