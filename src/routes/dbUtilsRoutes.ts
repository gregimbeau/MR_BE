import express from "express";
import pool from "../database";

const router = express.Router();

// Seed database endpoint
router.post("/seed-database", async (_req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    // Seeding vendors
    const vendors = [
      { name: "John Doe" },
      { name: "Lisa Prat" },
      { name: "Rob Bird" },
      { name: "Alice Cooper" },
      { name: "Lisa Prat" },
    ];
    for (const vendor of vendors) {
      await client.query(
        "INSERT INTO vendors (name) VALUES ($1)",
        [vendor.name]
      );
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
      await client.query(
        "INSERT INTO buyers (name, company_name) VALUES ($1, $2)",
        [buyer.name, buyer.company]
      );
    }

    await client.query("COMMIT"); // Commit transaction
    res.status(200).send("Database seeded successfully");
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction on error
    console.error(error);
    res.status(500).send("Error seeding database");
  } finally {
    client.release(); // Release client back to the pool
  }
});

// Clear database endpoint
router.post("/clear-database", async (_req, res) => {
  try {
    await pool.query("DELETE FROM appointments");
    await pool.query("DELETE FROM buyers");
    await pool.query("DELETE FROM vendors");
    res.status(200).send("Database cleared successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error clearing database");
  }
});

export default router;
