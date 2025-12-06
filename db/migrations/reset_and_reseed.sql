-- Truncate all tables and reset sequences

-- Disable triggers temporarily to avoid foreign key issues
SET session_replication_role = 'replica';

-- Truncate all tables (CASCADE removes dependent data)
TRUNCATE TABLE proposals CASCADE;
TRUNCATE TABLE rfp_vendors CASCADE;
TRUNCATE TABLE rfps CASCADE;
TRUNCATE TABLE vendors CASCADE;
TRUNCATE TABLE users CASCADE;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Reset sequences to start from 1
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE vendors_id_seq RESTART WITH 1;
ALTER SEQUENCE rfps_id_seq RESTART WITH 1;
ALTER SEQUENCE rfp_vendors_id_seq RESTART WITH 1;
ALTER SEQUENCE proposals_id_seq RESTART WITH 1;

-- Verify tables are empty
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'vendors', COUNT(*) FROM vendors
UNION ALL
SELECT 'rfps', COUNT(*) FROM rfps
UNION ALL
SELECT 'rfp_vendors', COUNT(*) FROM rfp_vendors
UNION ALL
SELECT 'proposals', COUNT(*) FROM proposals;
