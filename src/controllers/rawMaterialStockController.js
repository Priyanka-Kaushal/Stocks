import pool from "../utils/db.js";

const TABLE = "inventory.raw_materials";

export const createRawMaterial = async (req, res) => {
  try {
    const { name, status = "active" } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name || !image) {
      return res
        .status(400)
        .json({ success: false, message: "Name and image are required." });
    }

    const query = `
      INSERT INTO ${TABLE} (name, image, status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [name, image, status];
    const { rows } = await pool.query(query, values);

    res.status(201).json({ success: true, data: rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({
          success: false,
          message: "Raw material with this name already exists.",
        });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllRawMaterials = async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT * FROM ${TABLE} ORDER BY created_at DESC`
    );
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRawMaterialById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(`SELECT * FROM ${TABLE} WHERE id = $1`, [
      id,
    ]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Raw material not found." });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const image = req.file ? req.file.path : null;

    const fields = [];
    const values = [];
    let idx = 1;

    if (name) {
      fields.push(`name = $${idx++}`);
      values.push(name);
    }
    if (status) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (image) {
      fields.push(`image = $${idx++}`);
      values.push(image);
    }

    if (fields.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update." });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE ${TABLE}
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Raw material not found." });
    }

    res.status(200).json({ success: true, data: rows[0] });
  } catch (error) {
    if (error.code === "23505") {
      return res
        .status(409)
        .json({
          success: false,
          message: "Raw material with this name already exists.",
        });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query(
      `DELETE FROM ${TABLE} WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Raw material not found." });
    }
    res.status(200).json({ success: true, message: "Raw material deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
