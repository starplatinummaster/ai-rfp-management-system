# Step 1: Truncate all tables and reset sequences
psql -h localhost -U postgres -d rfp_system -f "db\migrations\reset_and_reseed.sql"

# Step 2: Reseed with fresh data
psql -h localhost -U postgres -d rfp_system -f "db\seeds\seed_data.sql"
