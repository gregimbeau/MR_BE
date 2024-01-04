import express from "express";
import pool from "../database";

const router = express.Router();

// Get all appointments
router.get("/appointments", async (req, res) => {
  try {
    const allAppointments = await pool.query("SELECT * FROM Appointment");
    res.json(allAppointments.rows);
  } catch (err) {
    // Type assertion
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


// Get a single appointment by ID
router.get("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const appointment = await pool.query(
      "SELECT * FROM Appointment WHERE id = $1",
      [id]
    );
    if (appointment.rows.length === 0) {
      return res.status(404).send("Appointment not found");
    }
    res.json(appointment.rows[0]);
  } catch (err) {
    // Type assertion
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


// Create a new appointment
router.post("/appointments", async (req, res) => {
  const { title, type, location, host_id, client_id, start_time, end_time } =
    req.body;

  try {
    // Check for conflicting appointments
    const conflicts = await pool.query(
      "SELECT * FROM Appointment WHERE (host_id = $1 OR client_id = $2) AND start_time < $4 AND end_time > $3",
      [host_id, client_id, start_time, end_time]
    );

    if (conflicts.rows.length > 0) {
      return res.status(400).send("Conflicting appointment exists");
    }

    const newAppointment = await pool.query(
      "INSERT INTO Appointment (title, type, location, host_id, client_id, start_time, end_time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [title, type, location, host_id, client_id, start_time, end_time]
    );
    res.json(newAppointment.rows[0]);
  } catch (err) {
    // Type assertion
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});


// Update an appointment
router.put("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  const { title, type, location, host_id, client_id, start_time, end_time } =
    req.body;

  // Check for conflicting appointments
  const conflicts = await pool.query(
    "SELECT * FROM Appointment WHERE id != $1 AND (host_id = $2 OR client_id = $3) AND start_time < $5 AND end_time > $4",
    [id, host_id, client_id, start_time, end_time]
  );

  if (conflicts.rows.length > 0) {
    return res.status(400).send("Conflicting appointment exists");
  }

  try {
    const updateAppointment = await pool.query(
      "UPDATE Appointment SET title = $2, type = $3, location = $4, host_id = $5, client_id = $6, start_time = $7, end_time = $8 WHERE id = $1 RETURNING *",
      [id, title, type, location, host_id, client_id, start_time, end_time]
    );

    if (updateAppointment.rows.length === 0) {
      return res.status(404).send("Appointment not found");
    }

    res.json(updateAppointment.rows[0]);
  } catch (err) {
    // Type assertion
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// Delete an appointment
router.delete("/appointments/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deleteAppointment = await pool.query(
      "DELETE FROM Appointment WHERE id = $1 RETURNING *",
      [id]
    );

    if (deleteAppointment.rowCount === 0) {
      return res.status(404).send("Appointment not found");
    }

    res.json({ message: "Appointment deleted" });
  } catch (err) {
    // Type assertion
    const error = err as Error;
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;
