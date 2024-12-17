import express from "express";
import userRouter from "./routes/users";

const app = express();
app.use(express.json());

app.use("/user", userRouter);

app.listen(8080, () => {
    console.log("Smarthire backend is live on http://localhost:8080");
})