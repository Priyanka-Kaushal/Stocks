import pool from "../utils/db.js";

const SCHEMA_TABLE = "inventory.machines";

export const addMachine = async (req, res) => {
  try {
    const { machine_name, plant_id, status, date } = req.body;

    if (!machine_name || !plant_id) {
      return res.status(400).json({
        success: false,
        message: "machine_name and plant_id are required.",
      });
    }

    if (status && !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'active' or 'inactive'.",
      });
    }

    const normalizedDate = date
      ? new Date(date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    const result = await pool.query(
      `INSERT INTO ${SCHEMA_TABLE} (machine_name, plant_id, status, date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [machine_name, plant_id, status || "active", normalizedDate]
    );

    res.status(201).json({
      success: true,
      message: "Machine added successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error in addMachine:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const allMachine = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM ${SCHEMA_TABLE} ORDER BY created_at DESC`
    );
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMachine = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT * FROM ${SCHEMA_TABLE} WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Machine not found." });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateMachine = async (req, res) => {
  try {
    const { id } = req.params;
    const { machine_name, plant_id, status, date } = req.body;

    if (!machine_name && !plant_id && !status && !date) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Provide at least one field to update.",
        });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (machine_name) {
      fields.push(`machine_name=$${idx++}`);
      values.push(machine_name);
    }
    if (plant_id) {
      fields.push(`plant_id=$${idx++}`);
      values.push(plant_id);
    }
    if (status) {
      if (!["active", "inactive"].includes(status)) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Status must be 'active' or 'inactive'.",
          });
      }
      fields.push(`status=$${idx++}`);
      values.push(status);
    }
    if (date) {
      fields.push(`date=$${idx++}`);
      values.push(new Date(date).toISOString().split("T")[0]);
    }

    values.push(id);

    const result = await pool.query(
      `UPDATE ${SCHEMA_TABLE}
       SET ${fields.join(", ")}, updated_at=NOW()
       WHERE id=$${idx}
       RETURNING *`,
      values
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Machine not found." });
    }

    res.status(200).json({
      success: true,
      message: "Machine updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteMachine = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM ${SCHEMA_TABLE} WHERE id=$1 RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Machine not found." });
    }

    res.status(200).json({
      success: true,
      message: "Machine deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
