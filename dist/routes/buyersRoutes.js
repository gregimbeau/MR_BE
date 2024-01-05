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
// Get all buyers
router.get("/buyers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allBuyers = yield database_1.default.query("SELECT * FROM buyers");
        res.json(allBuyers.rows);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Get a single buyer by ID
router.get("/buyers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const buyer = yield database_1.default.query("SELECT * FROM buyers WHERE id = $1", [id]);
        if (buyer.rows.length === 0) {
            return res.status(404).send("Buyer not found");
        }
        res.json(buyer.rows[0]);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Create a new buyer
router.post("/buyers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, company_name } = req.body;
    try {
        const newBuyer = yield database_1.default.query("INSERT INTO buyers (name, company_name) VALUES ($1, $2) RETURNING *", [name, company_name]);
        res.json(newBuyer.rows[0]);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Update a buyer
router.put("/buyers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, company_name } = req.body;
    try {
        const updateBuyer = yield database_1.default.query("UPDATE buyers SET name = $1, company_name = $2 WHERE id = $3 RETURNING *", [name, company_name, id]);
        if (updateBuyer.rows.length === 0) {
            return res.status(404).send("Buyer not found");
        }
        res.json(updateBuyer.rows[0]);
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
// Delete a buyer
router.delete("/buyers/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteBuyer = yield database_1.default.query("DELETE FROM buyers WHERE id = $1 RETURNING *", [id]);
        if (deleteBuyer.rowCount === 0) {
            return res.status(404).send("Buyer not found");
        }
        res.json({ message: "Buyer deleted" });
    }
    catch (err) {
        const error = err;
        console.error(error.message);
        res.status(500).send("Server Error");
    }
}));
exports.default = router;
