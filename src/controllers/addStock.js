import { supabase } from '../utils/supabaseClient.js';

export const addStock = async (req, res) => {
  try {
    const { name, quantity, unit, category, price, stock = 0 } = req.body;

    if (!name || !quantity || !unit || !price) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const validUnits = ["kg", "g", "mg", "lb", "oz"];
    if (!validUnits.includes(unit)) {
      return res.status(400).json({ success: false, message: "Invalid unit" });
    }

    const { data, error } = await supabase
      .from('stock')
      .insert([{ name, quantity, unit, category, price, stock }])
      .select();

    if (error) throw error;

    return res.status(201).json({ success: true, message: "Stock added", data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

