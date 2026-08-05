import express from "express";
import cors from "cors";
const app = express();

//basic config -> middleware (app.use)
app.use(express.json({limit: "16kb"})) 
app.use(express.urlencoded({extended: true , limit :"16kb"}))
app.use(express.static("public"));

//cors config
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "https://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//import routes
import heathCheckRouter from "./routes/healthcheck.routes.js";

app.use("/api/v1/healthcheck/",heathCheckRouter);

app.get("/", (req, res) => {
  res.send("welcome to nexum");
});
export default app;
