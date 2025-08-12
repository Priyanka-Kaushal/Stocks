
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS inventory.requirement_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    type VARCHAR(20) NOT NULL DEFAULT 'requirement' CHECK (type = 'requirement'),

    raw_material_type_id UUID NOT NULL,
    quantity_value NUMERIC NOT NULL,
    quantity_photo TEXT NOT NULL,

    vehicle_type_id UUID NOT NULL,
    vehicle_reg_number VARCHAR(255) NOT NULL,
    vehicle_reg_photo TEXT NOT NULL,

    stock_id UUID NOT NULL,

    supplier_name VARCHAR(255) NOT NULL,
    supplier_contact_number VARCHAR(50) NOT NULL,

    price_per_ton NUMERIC NOT NULL,

    moisture_content_value NUMERIC NOT NULL,
    moisture_content_image TEXT NOT NULL,

    ash_content_value NUMERIC NOT NULL,
    ash_content_image TEXT NOT NULL,

    gcv_value NUMERIC NOT NULL,
    gcv_image TEXT NOT NULL,

    supervisor_name VARCHAR(255) NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


ALTER TABLE inventory.requirement_forms
  ADD CONSTRAINT fk_raw_material
  FOREIGN KEY (raw_material_type_id) REFERENCES inventory.raw_materials(id);

ALTER TABLE inventory.requirement_forms
  ADD CONSTRAINT fk_vehicle
  FOREIGN KEY (vehicle_type_id) REFERENCES inventory.vehicles(id);

ALTER TABLE inventory.requirement_forms
  ADD CONSTRAINT fk_stock
  FOREIGN KEY (stock_id) REFERENCES inventory.stock(id);
