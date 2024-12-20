import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/users";
import jobRouter from "./routes/jobs";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
})

app.use("/user", userRouter);
app.use("/job", jobRouter);

app.listen(8080, () => {
    console.log("Smarthire backend is live on http://localhost:8080");
})