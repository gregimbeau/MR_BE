import express from "express";
import pool from "../database";

const router = express.Router();

// Get all vendors
router.get("/vendors", async (req, res) => {
  try {
    const allVendors = await pool.query(
      "SELECT id, name FROM vendors"
    );
    res.json(allVendors.rows);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get a single vendor by ID
router.get("/vendors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const vendor = await pool.query("SELECT * FROM vendors WHERE id = $1", [
      id,
    ]);
    if (vendor.rows.length === 0) {
      return res.status(404).send("Vendor not found");
    }
    res.json(vendor.rows[0]);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Create a new vendor
router.post("/vendors", async (req, res) => {
  const { name } = req.body;
  try {
    const newVendor = await pool.query(
      "INSERT INTO vendors (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.json(newVendor.rows[0]);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Update a vendor
router.put("/vendors/:id", async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const updateVendor = await pool.query(
      "UPDATE vendors SET name = $1, WHERE id = $2 RETURNING *",
      [name, id]
    );
    if (updateVendor.rows.length === 0) {
      return res.status(404).send("Vendor not found");
    }
    res.json(updateVendor.rows[0]);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Delete a vendor
router.delete("/vendors/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteVendor = await pool.query(
      "DELETE FROM vendors WHERE id = $1 RETURNING *",
      [id]
    );
    if (deleteVendor.rowCount === 0) {
      return res.status(404).send("Vendor not found");
    }
    res.json({ message: "Vendor deleted" });
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;
