import { Router } from "express";
import { validateSession } from "./middleware";
import { getApplications, getApplication, addApplication } from "../models/applications";
import {writeFile} from "node:fs/promises"
import { gradeResume } from "../agent";
import { getJob } from "../models/jobs";
import { btoa } from "node:buffer";
import pdf from "pdf-parse"

const applicationRouter = Router();

applicationRouter.use(validateSession({
    type: ["hr", "applicant"]
}))

applicationRouter.get("/", async (req, res, next) => {
    const user = req.userId;

    try {
        const applications = getApplications(user!)
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

applicationRouter.post("/", async (req, res, next) => {
    try {
        const userId = req.userId;
        const {resume, jobId} = req.body;

        const job = await getJob(jobId)

        const pdfData = await pdf(Buffer.from(resume, "base64"))

        const analysis = await gradeResume(pdfData.text, job.title, job.description, job.experience!)
        console.log(analysis)

        // await addApplication({
        //     userId,
        //     jobId,
        //     resume,
        //     score: analysis.score,
        //     suggestions: analysis.suggestions
        // })

        res.sendStatus(200);
    } catch (error) {
        console.error(error)
        res.send(500)
        next(error)
    }
})

export default applicationRouter;