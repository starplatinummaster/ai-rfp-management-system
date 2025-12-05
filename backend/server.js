require('dotenv').config();
const app = require('./src/app');
const pool = require('./src/database');
const emailMonitorService = require('./src/services/emailMonitorService');

const PORT = process.env.PORT || 5000;

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Database connected successfully');
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  
  // Start email monitoring if credentials are configured
  if (process.env.IMAP_USER && process.env.IMAP_PASS) {
    setTimeout(() => {
      emailMonitorService.start();
      console.log(`📧 Email monitoring started`);
    }, 2000); // Start after 2 seconds
  } else {
    console.log(`⚠️  Email monitoring disabled - configure IMAP credentials`);
  }
});