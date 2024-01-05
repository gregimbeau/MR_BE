"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const appointmentRoutes_1 = __importDefault(require("./routes/appointmentRoutes"));
const buyersRoutes_1 = __importDefault(require("./routes/buyersRoutes"));
const vendorsRoutes_1 = __importDefault(require("./routes/vendorsRoutes"));
const dbUtilsRoutes_1 = __importDefault(require("./routes/dbUtilsRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use("/api", appointmentRoutes_1.default);
app.use("/api", buyersRoutes_1.default);
app.use("/api", vendorsRoutes_1.default);
app.use("/api", dbUtilsRoutes_1.default);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
