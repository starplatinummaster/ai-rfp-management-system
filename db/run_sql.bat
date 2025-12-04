@echo off
set PGPASSWORD=postgres

echo Running initial schema...
psql -h localhost -U postgres -d rfp_system -f "db\migrations\initial_schema.sql"

echo Running indexes...
psql -h localhost -U postgres -d rfp_system -f "db\indexes\indexes.sql"

echo Running seed data...
psql -h localhost -U postgres -d rfp_system -f "db\seeds\seed_data.sql"

echo Done!
pause