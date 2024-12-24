import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/users";
import jobRouter from "./routes/jobs";
import applicationRouter from "./routes/applications";

const app = express();
app.use(cors({
    origin: ["http://localhost:4173", "http://localhost:5173"],
    credentials: true
}))

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
})

app.use("/user", userRouter);
app.use("/job", jobRouter);
app.use("/application", applicationRouter);

app.listen(8080, () => {
    console.log("Smarthire backend is live on http://localhost:8080");
})