import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { handleEnquiry } from "./shared/enquiryMailer.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Website enquiry email endpoint.
app.post("/api/send-enquiry", handleEnquiry);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Y.K. Classes enquiry server running at http://localhost:${PORT}`);
});
