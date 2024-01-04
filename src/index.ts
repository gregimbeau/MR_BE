import express from "express";
import bodyParser from "body-parser";
import appointmentRoutes from "./routes/appointmentRoutes";
import buyersRoutes from "./routes/buyersRoutes";
import vendorsRoutes from "./routes/vendorsRoutes";
import dbUtilsRoutes from "./routes/dbUtilsRoutes"; 
import cors from "cors";


const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api", appointmentRoutes);
app.use("/api", buyersRoutes);
app.use("/api", vendorsRoutes);
app.use("/api", dbUtilsRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
