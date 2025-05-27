-- SimpFlow Database Migration
-- Date: 2025-05-27
-- Description: Add status column to routes table and required_fields column to route_config table
-- This migration supports the 4 backend improvements: route validation, rate limiting, required fields, and route status

-- Add status column to routes table
-- This supports route status feature (active/inactive)
ALTER TABLE routes ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';

-- Update existing routes to have 'active' status based on is_active boolean
UPDATE routes SET status = CASE 
    WHEN is_active = true THEN 'active'
    WHEN is_active = false THEN 'inactive'
    ELSE 'active'
END WHERE status IS NULL;

-- Add required_fields column to route_config table
-- This supports required fields validation feature
ALTER TABLE route_config ADD COLUMN IF NOT EXISTS required_fields JSONB DEFAULT '[]'::jsonb;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_routes_status ON routes(status);
CREATE INDEX IF NOT EXISTS idx_route_config_required_fields ON route_config USING GIN(required_fields);

-- Add comments for documentation
COMMENT ON COLUMN routes.status IS 'Route status: active, inactive, draft, archived';
COMMENT ON COLUMN route_config.required_fields IS 'Array of required field names that must be present in webhook data';

-- Verify migration
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name IN ('routes', 'route_config') 
    AND column_name IN ('status', 'required_fields')
ORDER BY table_name, column_name;
