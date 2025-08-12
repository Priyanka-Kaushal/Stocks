import pool from '../utils/db.js';

export const rawMaterialStock = async (req, res) => {
  try {
    const { name, status } = req.body;
    console.log("req.body:", req.body);



    const image = req.file ? req.file.path : null;
console.log("req.file:", req.file);
    if (!name || !image) {
      return res.status(400).json({ success: false, message: "Name and image are required." });
    }

    const insertQuery = `
      INSERT INTO inventory.raw_materials (name, image, status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const values = [name, image, status || 'active'];

    const result = await pool.query(insertQuery, values);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Raw material with this name already exists.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


export const allRawMaterialStock = async (req, res) => {
  try {
    const selectQuery = `SELECT * FROM inventory.raw_materials ORDER BY created_at DESC`;
    const result = await pool.query(selectQuery);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const individualRawmaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const selectQuery = `SELECT * FROM inventory.raw_materials WHERE id = $1`;
    const result = await pool.query(selectQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Raw material not found.' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateRawMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;
    const image = req.file ? req.file.path : undefined;

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
    fields.push(`updated_at = NOW()`);

    if (fields.length === 1) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    const updateQuery = `
      UPDATE inventory.raw_materials SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *;
    `;

    values.push(id);

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Raw material not found' });
    }

    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ success: false, message: 'Raw material with this name already exists.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteRawmaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = `DELETE FROM inventory.raw_materials WHERE id = $1 RETURNING *;`;
    const result = await pool.query(deleteQuery, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Raw material not found.' });
    }

    res.status(200).json({ success: true, message: 'Raw material deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
