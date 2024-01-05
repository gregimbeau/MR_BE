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
// Seed database endpoint
router.post("/seed-database", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield database_1.default.connect();
    try {
        yield client.query("BEGIN"); // Start transaction
        // Seeding vendors
        const vendors = [
            { name: "John Doe" },
            { name: "Lisa Prat" },
            { name: "Rob Bird" },
            { name: "Alice Cooper" },
            { name: "Lisa Prat" },
        ];
        for (const vendor of vendors) {
            yield client.query("INSERT INTO vendors (name) VALUES ($1)", [vendor.name]);
        }
        // Seeding buyers
        const buyers = [
            { name: "Alice Johnson", company: "Tech Innovations" },
            { name: "Bob Smith", company: "Future Enterprises" },
            { name: "Cathy Brown", company: "Creative Solutions" },
            { name: "David Wilson", company: "Efficient Dynamics" },
            { name: "Emily Davis", company: "NextGen Creators" },
        ];
        for (const buyer of buyers) {
            yield client.query("INSERT INTO buyers (name, company_name) VALUES ($1, $2)", [buyer.name, buyer.company]);
        }
        yield client.query("COMMIT"); // Commit transaction
        res.status(200).send("Database seeded successfully");
    }
    catch (error) {
        yield client.query("ROLLBACK"); // Rollback transaction on error
        console.error(error);
        res.status(500).send("Error seeding database");
    }
    finally {
        client.release(); // Release client back to the pool
    }
}));
// Clear database endpoint
router.post("/clear-database", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield database_1.default.query("DELETE FROM appointments");
        yield database_1.default.query("DELETE FROM buyers");
        yield database_1.default.query("DELETE FROM vendors");
        res.status(200).send("Database cleared successfully");
    }
    catch (error) {
        console.error(error);
        res.status(500).send("Error clearing database");
    }
}));
exports.default = router;
