-- AI-Powered RFP Management System - Performance Indexes
-- Critical indexes for production performance

-- Foreign Key Indexes (Critical for JOIN performance)
CREATE INDEX idx_rfps_user_id ON rfps(user_id);
CREATE INDEX idx_vendors_user_id ON vendors(user_id);
CREATE INDEX idx_rfp_vendors_rfp_id ON rfp_vendors(rfp_id);
CREATE INDEX idx_rfp_vendors_vendor_id ON rfp_vendors(vendor_id);
CREATE INDEX idx_proposals_rfp_id ON proposals(rfp_id);
CREATE INDEX idx_proposals_vendor_id ON proposals(vendor_id);

-- Status and Email Tracking Indexes
CREATE INDEX idx_rfps_status ON rfps(status);
CREATE INDEX idx_rfp_vendors_email_status ON rfp_vendors(email_status);
CREATE INDEX idx_proposals_processing_status ON proposals(processing_status);
CREATE INDEX idx_rfp_vendors_email_message_id ON rfp_vendors(email_message_id);

-- Timestamp Indexes for Sorting and Filtering
CREATE INDEX idx_rfps_created_at ON rfps(created_at DESC);
CREATE INDEX idx_vendors_created_at ON vendors(created_at DESC);
CREATE INDEX idx_proposals_received_at ON proposals(received_at DESC);
CREATE INDEX idx_rfp_vendors_sent_at ON rfp_vendors(sent_at DESC);

-- JSONB Indexes for AI Data Queries (GIN indexes for JSON operations)
CREATE INDEX idx_rfps_structured_requirements ON rfps USING GIN (structured_requirements);
CREATE INDEX idx_proposals_structured_proposal ON proposals USING GIN (structured_proposal);
CREATE INDEX idx_proposals_ai_scores ON proposals USING GIN (ai_scores);

-- Composite Indexes for Common Query Patterns
CREATE INDEX idx_rfps_user_status ON rfps(user_id, status);
CREATE INDEX idx_vendors_user_category ON vendors(user_id, category);
CREATE INDEX idx_proposals_rfp_status ON proposals(rfp_id, processing_status);

-- Email Search Indexes
CREATE INDEX idx_vendors_email ON vendors(email);
CREATE INDEX idx_proposals_email_subject ON proposals(email_subject);



