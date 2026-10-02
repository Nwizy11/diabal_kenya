-- Adds the fields introduced by the new order form design
-- (email, gender, preferred delivery date) and makes "city" optional
-- since the new form no longer collects it as a separate field.

ALTER TABLE public.orders
  ADD COLUMN email text,
  ADD COLUMN gender text,
  ADD COLUMN preferred_delivery_date text;

ALTER TABLE public.orders
  ALTER COLUMN city DROP NOT NULL;
