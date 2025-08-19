import pool from "../utils/db.js";

const SCHEMA_TABLE = "inventory.attendance";

export const userAttendance = async (req, res) => {
  try {
    const { userId, status, date } = req.body;

    if (!userId || !status) {
      return res.status(400).json({
        success: false,
        message: "userId and status are required.",
      });
    }

    if (!["present", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'present' or 'absent'.",
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

    // Check if attendance already exists
    const existing = await pool.query(
      `SELECT id FROM ${SCHEMA_TABLE} WHERE user_id = $1 AND date = $2`,
      [userId, normalizedDate]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Attendance already marked for this date.",
      });
    }

    // Insert new attendance record
    const result = await pool.query(
      `INSERT INTO ${SCHEMA_TABLE} (user_id, status, date, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       RETURNING *`,
      [userId, status, normalizedDate]
    );

    return res.status(201).json({
      success: true,
      message: "Attendance recorded successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error in userAttendance:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const selectQuery = `
      SELECT id, user_id, status, date, created_at, updated_at
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
    console.error("Error fetching attendance:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAttendanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const selectQuery = `
      SELECT id, user_id, status, date, created_at, updated_at
      FROM ${SCHEMA_TABLE}
      WHERE id = $1
    `;

    const result = await pool.query(selectQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching individual attendance:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateUserAttendance = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date } = req.body;

    if (!status && !date) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field (status or date) must be provided to update.",
      });
    }

    if (status && !["present", "absent"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'present' or 'absent'.",
      });
    }

    const checkQuery = `SELECT * FROM ${SCHEMA_TABLE} WHERE id = $1`;
    const existing = await pool.query(checkQuery, [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    const fields = [];
    const values = [];
    let idx = 1;

    if (status) {
      fields.push(`status = $${idx}`);
      values.push(status);
      idx++;
    }

    if (date) {
      const inputDate = new Date(date);
      if (isNaN(inputDate.getTime())) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid date format." });
      }
      fields.push(`date = $${idx}`);
      values.push(inputDate.toISOString().split("T")[0]);
      idx++;
    }

    fields.push(`updated_at = NOW()`);

    const updateQuery = `
      UPDATE ${SCHEMA_TABLE}
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *
    `;
    values.push(id);

    const result = await pool.query(updateQuery, values);

    return res.status(200).json({
      success: true,
      message: "Attendance record updated successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating attendance:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const checkQuery = `SELECT * FROM ${SCHEMA_TABLE} WHERE id = $1`;
    const existing = await pool.query(checkQuery, [id]);

    if (existing.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Attendance record not found.",
      });
    }

    const deleteQuery = `DELETE FROM ${SCHEMA_TABLE} WHERE id = $1 RETURNING *`;
    const result = await pool.query(deleteQuery, [id]);

    return res.status(200).json({
      success: true,
      message: "Attendance record deleted successfully.",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
