-- AI-Powered RFP Management System - Initial Database Schema
-- Production-Ready Schema with Overflow Protection

-- Enable UUID extension for better IDs (optional)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. RFPS Table
CREATE TABLE rfps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    structured_requirements JSONB, -- AI-generated structured data (max 100KB)
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'closed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. VENDORS Table
CREATE TABLE vendors (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, email) -- Prevent duplicate vendor emails per user
);

-- 4. RFP_VENDORS Junction Table
CREATE TABLE rfp_vendors (
    id SERIAL PRIMARY KEY,
    rfp_id INTEGER NOT NULL REFERENCES rfps(id) ON DELETE CASCADE,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    sent_at TIMESTAMP,
    email_status VARCHAR(50) DEFAULT 'pending' CHECK (email_status IN ('pending', 'sent', 'delivered', 'bounced', 'failed')),
    email_message_id VARCHAR(255), -- For email tracking and threading
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(rfp_id, vendor_id) -- Prevent duplicate RFP-Vendor pairs
);

-- 5. PROPOSALS Table
CREATE TABLE proposals (
    id SERIAL PRIMARY KEY,
    rfp_id INTEGER NOT NULL REFERENCES rfps(id) ON DELETE CASCADE,
    vendor_id INTEGER NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    raw_email_content TEXT, -- Original email content (max 5MB with truncation)
    email_subject VARCHAR(500), -- Email subject for parsing context
    structured_proposal JSONB, -- AI-parsed proposal data (max 500KB)
    ai_scores JSONB, -- AI-generated scores and analysis
    processing_status VARCHAR(50) DEFAULT 'received' CHECK (processing_status IN ('received', 'processing', 'completed', 'failed')),
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rfps_updated_at BEFORE UPDATE ON rfps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

