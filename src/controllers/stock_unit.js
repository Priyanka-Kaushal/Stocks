import pool from "../utils/db.js";

const SCHEMA_TABLE = "inventory.units";

export const addStockUnit = async (req, res) => {
  try {
    const { name, date } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Stock unit name is required.",
      });
    }

    const inputDate = date ? new Date(date) : new Date();
    if (isNaN(inputDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD.",
      });
    }
    const normalizedDate = inputDate.toISOString().split("T")[0];

    const result = await pool.query(
      `INSERT INTO ${SCHEMA_TABLE} (name, date, created_at, updated_at)
       VALUES ($1, $2, NOW(), NOW())
       RETURNING *`,
      [name, normalizedDate]
    );

    return res.status(201).json({
      success: true,
      message: "Stock unit added successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error in addStockUnit:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStockUnits = async (req, res) => {
  try {
    const selectQuery = `
      SELECT id, name, date, created_at, updated_at
      FROM ${SCHEMA_TABLE}
      ORDER BY created_at DESC
    `;

    const result = await pool.query(selectQuery);

    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching stock units:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStockUnitById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Unit ID is required.",
      });
    }

    const selectQuery = `
      SELECT id, name, date, created_at, updated_at
      FROM ${SCHEMA_TABLE}
      WHERE id = $1
    `;

    const result = await pool.query(selectQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stock unit not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching stock unit:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStockUnit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date } = req.body;

    if (!name && !date) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update (name or date).",
      });
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (name) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }

    if (date) {
      const inputDate = new Date(date);
      if (isNaN(inputDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid date format. Use YYYY-MM-DD.",
        });
      }
      fields.push(`date = $${index++}`);
      values.push(inputDate.toISOString().split("T")[0]);
    }

    values.push(id);

    const updateQuery = `
      UPDATE ${SCHEMA_TABLE}
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE id = $${index}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stock unit not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock unit updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating stock unit:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteStockUnit = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteQuery = `DELETE FROM ${SCHEMA_TABLE} WHERE id = $1 RETURNING *`;

    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stock unit not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Stock unit deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting stock unit:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
