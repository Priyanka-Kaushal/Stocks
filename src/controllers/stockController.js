import pool from '../utils/db.js';

const SCHEMA_TABLE = 'inventory.stock';

export const createStock = async (req, res) => {
  const { name, quantity, unit, category = null, price = null } = req.body;

  if (!name || !quantity || !unit) {
    return res.status(400).json({
      success: false,
      message: 'name, quantity and unit are required fields',
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO ${SCHEMA_TABLE} (name, quantity, unit, category, price)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, quantity, unit, category, price]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


export const getAllStock = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM ${SCHEMA_TABLE} ORDER BY id ASC`);
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const individualStock = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(`SELECT * FROM ${SCHEMA_TABLE} WHERE id = $1`, [id]);
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Stock not found' });
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateStock = async (req, res) => {
  const id = req.params.id;
  const { name, quantity, unit, price } = req.body;  
  try {
    const result = await pool.query(
      `UPDATE ${SCHEMA_TABLE} SET name = $1, quantity = $2, unit = $3, price = $4 WHERE id = $5 RETURNING *`,
      [name, quantity, unit, price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Stock not found' });
    }
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteStock = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      `DELETE FROM ${SCHEMA_TABLE} WHERE id = $1 RETURNING *`,
      [id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Stock not found' });
    res.status(200).json({ success: true, message: 'Stock deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Optional: Supabase version of createStock
export const createStockSupabase = async (req, res) => {
  const { name, quantity } = req.body;
  const { data, error } = await supabase.from('stock').insert([{ name, quantity }]);
  if (error) return res.status(400).json({ success: false, message: error.message });
  res.status(201).json({ success: true, data });
};
