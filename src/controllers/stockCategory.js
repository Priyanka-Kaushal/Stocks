import pool from "../utils/db.js";

const SCHEMA_TABLE = "inventory.stock_category";

export const add_stock_category = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required.",
      });
    }

    if (status && !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'active' or 'inactive'.",
      });
    }

    const insertQuery = `
      INSERT INTO ${SCHEMA_TABLE} (name, description, status, created_at, updated_at)
      VALUES ($1, $2, $3, NOW(), NOW())
      RETURNING *
    `;

    const result = await pool.query(insertQuery, [
      name,
      description || null,
      status || "active",
    ]);

    return res.status(201).json({
      success: true,
      message: "Stock category added successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding stock category:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const get_stock_category = async (req, res) => {
  try {
    const selectQuery = `
      SELECT id, name, description, status, created_at, updated_at
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
    console.error("Error fetching stock categories:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const fetch_stock_category = async (req, res) => {
  try {
    const { id } = req.params;

    const selectQuery = `
      SELECT id, name, description, status, created_at, updated_at
      FROM ${SCHEMA_TABLE}
      WHERE id = $1
    `;

    const result = await pool.query(selectQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stock category not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching stock category:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const update_stock_category = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    if (!name && !description && !status) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (name, description, or status) is required to update.",
      });
    }

    if (status && !["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'active' or 'inactive'.",
      });
    }

    const checkQuery = `SELECT * FROM ${SCHEMA_TABLE} WHERE id = $1`;
    const existing = await pool.query(checkQuery, [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stock category not found.",
      });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) {
      fields.push(`name = $${idx}`);
      values.push(name);
      idx++;
    }
    if (description) {
      fields.push(`description = $${idx}`);
      values.push(description);
      idx++;
    }
    if (status) {
      fields.push(`status = $${idx}`);
      values.push(status);
      idx++;
    }

    fields.push(`updated_at = NOW()`);

    const updateQuery = `
      UPDATE inventory.stock_category
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: "Stock category updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating stock category:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const delete_stock_category = async (req, res) => {
  try {
    const { id } = req.params;

    const checkQuery = `SELECT * FROM ${SCHEMA_TABLE} WHERE id = $1`;
    const existing = await pool.query(checkQuery, [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Stock category not found.",
      });
    }

    const deleteQuery = `DELETE FROM ${SCHEMA_TABLE} WHERE id = $1 RETURNING *`;
    const result = await pool.query(deleteQuery, [id]);

    return res.status(200).json({
      success: true,
      message: "Stock category deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting stock category:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
