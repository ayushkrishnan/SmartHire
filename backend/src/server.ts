import express from "express";

const app = express();
app.use(express.json());

app.listen(8080, () => {
    console.log("Smarthire backend is live on http://localhost:8080");
})