import express from "express";
import pool from "../database";

const router = express.Router();

// Get all buyers
router.get("/buyers", async (req, res) => {
  try {
    const allBuyers = await pool.query("SELECT * FROM buyers");
    res.json(allBuyers.rows);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Get a single buyer by ID
router.get("/buyers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const buyer = await pool.query("SELECT * FROM buyers WHERE id = $1", [id]);
    if (buyer.rows.length === 0) {
      return res.status(404).send("Buyer not found");
    }
    res.json(buyer.rows[0]);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Create a new buyer
router.post("/buyers", async (req, res) => {
  const { name, company_name } = req.body;
  try {
    const newBuyer = await pool.query(
      "INSERT INTO buyers (name, company_name) VALUES ($1, $2) RETURNING *",
      [name, company_name]
    );
    res.json(newBuyer.rows[0]);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Update a buyer
router.put("/buyers/:id", async (req, res) => {
  const { id } = req.params;
  const { name, company_name } = req.body;
  try {
    const updateBuyer = await pool.query(
      "UPDATE buyers SET name = $1, company_name = $2 WHERE id = $3 RETURNING *",
      [name, company_name, id]
    );
    if (updateBuyer.rows.length === 0) {
      return res.status(404).send("Buyer not found");
    }
    res.json(updateBuyer.rows[0]);
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Delete a buyer
router.delete("/buyers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteBuyer = await pool.query(
      "DELETE FROM buyers WHERE id = $1 RETURNING *",
      [id]
    );
    if (deleteBuyer.rowCount === 0) {
      return res.status(404).send("Buyer not found");
    }
    res.json({ message: "Buyer deleted" });
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;
