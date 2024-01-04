import express from "express";
import bodyParser from "body-parser";
import appointmentRoutes from "./routes/appointmentRoutes";
import cors from "cors";


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api", appointmentRoutes);


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
