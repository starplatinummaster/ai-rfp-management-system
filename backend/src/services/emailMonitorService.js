const emailService = require('./emailService');

class EmailMonitorService {
  constructor() {
    this.isMonitoring = false;
    this.monitoringInterval = null;
  }

  start() {
    if (this.isMonitoring) {
      console.log('Email monitoring already active');
      return;
    }

    console.log('Starting email monitoring service...');
    this.isMonitoring = true;
    
    // Start IMAP monitoring
    emailService.startEmailMonitoring();
    
    // Set up periodic health checks
    this.monitoringInterval = setInterval(() => {
      this.healthCheck();
    }, 60000); // Check every minute
  }

  stop() {
    if (!this.isMonitoring) {
      console.log('Email monitoring not active');
      return;
    }

    console.log('Stopping email monitoring service...');
    this.isMonitoring = false;
    
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  healthCheck() {
    if (!this.isMonitoring) return;
    
    console.log(`Email monitoring health check - ${new Date().toISOString()}`);
    // Could add more sophisticated health checks here
  }

  getStatus() {
    return {
      monitoring: this.isMonitoring,
      started_at: this.startedAt,
      last_check: new Date().toISOString()
    };
  }
}

module.exports = new EmailMonitorService();