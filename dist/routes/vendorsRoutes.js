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
// Get all vendors
router.get("/vendors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allVendors = yield database_1.default.query("SELECT id, name FROM vendors");
        res.json(allVendors.rows);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Get a single vendor by ID
router.get("/vendors/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const vendor = yield database_1.default.query("SELECT * FROM vendors WHERE id = $1", [
            id,
        ]);
        if (vendor.rows.length === 0) {
            return res.status(404).send("Vendor not found");
        }
        res.json(vendor.rows[0]);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Create a new vendor
router.post("/vendors", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    try {
        const newVendor = yield database_1.default.query("INSERT INTO vendors (name) VALUES ($1) RETURNING *", [name]);
        res.json(newVendor.rows[0]);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Update a vendor
router.put("/vendors/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const updateVendor = yield database_1.default.query("UPDATE vendors SET name = $1, WHERE id = $2 RETURNING *", [name, id]);
        if (updateVendor.rows.length === 0) {
            return res.status(404).send("Vendor not found");
        }
        res.json(updateVendor.rows[0]);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Delete a vendor
router.delete("/vendors/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteVendor = yield database_1.default.query("DELETE FROM vendors WHERE id = $1 RETURNING *", [id]);
        if (deleteVendor.rowCount === 0) {
            return res.status(404).send("Vendor not found");
        }
        res.json({ message: "Vendor deleted" });
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
exports.default = router;
