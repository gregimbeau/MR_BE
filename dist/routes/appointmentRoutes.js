"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("../database"));
const router = express_1.default.Router();
// Get all appointments
router.get("/appointments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allAppointments = yield database_1.default.query("SELECT a.id, a.title, a.type, a.location, a.start_time, a.end_time, v.name as vendor_name, b.name as buyer_name, b.company_name " +
            "FROM appointments a " +
            "JOIN vendors v ON a.vendor_id = v.id " +
            "JOIN buyers b ON a.buyer_id = b.id");
        res.json(allAppointments.rows);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Get a single appointment by ID
router.get("/appointments/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const appointment = yield database_1.default.query("SELECT a.id, a.title, a.type, a.location, a.start_time, a.end_time, v.name as vendor_name, b.name as buyer_name, b.company_name " +
            "FROM appointments a " +
            "JOIN vendors v ON a.vendor_id = v.id " +
            "JOIN buyers b ON a.buyer_id = b.id " +
            "WHERE a.id = $1", [id]);
        if (appointment.rows.length === 0) {
            return res.status(404).send("Appointment not found");
        }
        res.json(appointment.rows[0]);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Create a new appointment
router.post("/appointments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, type, location, vendor_id, buyer_id, start_time, end_time } = req.body;
    try {
        // Query to find any overlapping appointments for the given host and client
        const overlappingAppointments = yield database_1.default.query("SELECT * FROM appointments WHERE " +
            "((vendor_id = $1 OR buyer_id = $2) AND " +
            "((start_time <= $3 AND end_time > $3) OR " + // overlaps with start time
            "(start_time < $4 AND end_time >= $4) OR " + // overlaps with end time
            "(start_time >= $3 AND end_time <= $4)))", // within new appointment
        [vendor_id, buyer_id, start_time, end_time]);
        if (overlappingAppointments.rows.length > 0) {
            return res.status(400).send("Conflicting appointment exists");
        }
        // Create new appointment if no overlap
        const newAppointment = yield database_1.default.query("INSERT INTO appointments (title, type, location, vendor_id, buyer_id, start_time, end_time) " +
            "VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *", [title, type, location, vendor_id, buyer_id, start_time, end_time]);
        res.json(newAppointment.rows[0]);
    }
    catch (error) {
        console.error("Error creating appointment: ", error);
        res.status(500).send("Server Error");
    }
}));
// Update an appointment
router.put("/appointments/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, type, location, vendor_id, buyer_id, start_time, end_time } = req.body;
    try {
        // Check for conflicting appointments, excluding the current appointment
        const overlappingAppointments = yield database_1.default.query("SELECT * FROM appointments WHERE id != $1 AND " +
            "((vendor_id = $2 OR buyer_id = $3) AND " +
            "((start_time <= $4 AND end_time > $4) OR " +
            "(start_time < $5 AND end_time >= $5) OR " +
            "(start_time >= $4 AND end_time <= $5)))", [id, vendor_id, buyer_id, start_time, end_time]);
        if (overlappingAppointments.rows.length > 0) {
            return res.status(400).send("Conflicting appointment exists");
        }
        // Update appointment if no overlap
        const updateAppointment = yield database_1.default.query("UPDATE appointments SET title = $1, type = $2, location = $3, vendor_id = $4, buyer_id = $5, start_time = $6, end_time = $7 " +
            "WHERE id = $8 RETURNING *", [title, type, location, vendor_id, buyer_id, start_time, end_time, id]);
        if (updateAppointment.rows.length === 0) {
            return res.status(404).send("Appointment not found");
        }
        res.json(updateAppointment.rows[0]);
    }
    catch (error) {
        console.error("Error updating appointment: ", error);
        res.status(500).send("Server Error");
    }
}));
// Delete an appointment
router.delete("/appointments/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteAppointment = yield database_1.default.query("DELETE FROM appointments WHERE id = $1 RETURNING *", [id]);
        if (deleteAppointment.rowCount === 0) {
            return res.status(404).send("Appointment not found");
        }
        res.json({ message: "Appointment deleted" });
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
exports.default = router;
