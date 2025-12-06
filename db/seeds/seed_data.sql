-- AI-Powered RFP Management System - Test Seed Data
-- Sample data for development and testing

-- Insert Test User
INSERT INTO users (username, email, password_hash) VALUES 
('admin', 'admin@rfpsystem.com', '$2b$10$example.hash.for.testing.purposes.only');

-- Insert Test Vendors (Indian Phone Numbers)
INSERT INTO vendors (user_id, name, email, phone, category) VALUES 
(1, 'TechCorp Solutions', 'sales@techcorp.com', '+91-98765-43210', 'Technology'),
(1, 'Office Supplies Plus', 'orders@officesupplies.com', '+91-98765-43211', 'Office Equipment'),
(1, 'Global IT Services', 'contact@globalit.com', '+91-98765-43212', 'IT Services'),
(1, 'Premium Electronics', 'sales@premiumelec.com', '+91-98765-43213', 'Electronics'),
(1, 'Business Solutions Inc', 'info@bizsolutions.com', '+91-98765-43214', 'Consulting');

-- Insert Test RFPs with AI-generated structured requirements (INR Currency)
INSERT INTO rfps (user_id, title, description, structured_requirements, status) VALUES 
(1, 'Office Laptop Procurement', 
 'Need 25 laptops: Intel i5+, 16GB RAM, 512GB SSD, Win11 Pro. Budget Rs 42L, 30 days delivery.',
 '{"items":[{"name":"Business Laptops","quantity":25,"specifications":"Intel i5+, 16GB RAM, 512GB SSD"}],"budget":{"max":4565000,"currency":"INR"},"timeline":{"deadline":"2024-02-15"},"terms":{"payment":"Net 30","warranty":"3 years"}}',
 'draft'),

(1, 'Conference Room Setup', 
 'Setup 3 conference rooms: projectors, screens, audio. Budget Rs 12.5L, 2 weeks.',
 '{"items":[{"name":"AV Equipment","quantity":3,"specifications":"Projector, screen, audio system per room"}],"budget":{"max":1494000,"currency":"INR"},"timeline":{"deadline":"2024-01-30"},"terms":{"payment":"50% upfront","warranty":"2 years"}}',
 'sent');

-- Insert RFP-Vendor relationships
INSERT INTO rfp_vendors (rfp_id, vendor_id, sent_at, email_status, email_message_id) VALUES 
(1, 1, '2024-01-15 10:00:00', 'sent', 'msg_001_techcorp_laptops'),
(1, 4, '2024-01-15 10:01:00', 'delivered', 'msg_002_premium_laptops'),
(2, 1, '2024-01-10 14:30:00', 'sent', 'msg_003_techcorp_conference'),
(2, 3, '2024-01-10 14:31:00', 'delivered', 'msg_004_globalit_conference');

-- Insert Sample Proposals (INR Currency)
INSERT INTO proposals (rfp_id, vendor_id, raw_email_content, email_subject, structured_proposal, ai_scores, processing_status, received_at) VALUES 
(1, 1, 
 'Dell Latitude 5540 laptops (25 units): Intel i5-1335U, 16GB RAM, 512GB SSD, Win11 Pro. Price: Rs 43,57,500 total. Delivery: 21 days. Net 30 terms. Installation included. - John Smith, TechCorp',
 'Re: Laptop RFP - TechCorp Proposal',
 '{"pricing":{"total":4357500,"per_unit":174300},"timeline":{"delivery_date":"2024-02-12"},"terms":{"payment":"Net 30","warranty":"3-year"},"specifications":{"processor":"Intel i5-1335U","memory":"16GB","storage":"512GB SSD"}}',
 '{"price_score":8.5,"timeline_score":9.0,"overall_score":9.0,"analysis":"Good pricing, fast delivery"}',
 'completed',
 '2024-01-16 09:30:00'),

(1, 4, 
 'HP EliteBook 840 G10 (25 units): Intel i5-1340P, 16GB RAM, 512GB SSD. Price: Rs 40,46,250 total. Delivery: 25 days. 2/10 net 30 terms. - Sarah Johnson, Premium Electronics',
 'Laptop RFP Response - Premium Electronics',
 '{"pricing":{"total":4046250,"per_unit":161850},"timeline":{"delivery_date":"2024-02-16"},"terms":{"payment":"2/10 net 30","warranty":"3-year"},"specifications":{"processor":"Intel i5-1340P","memory":"16GB","storage":"512GB SSD"}}',
 '{"price_score":9.5,"timeline_score":8.0,"overall_score":8.7,"analysis":"Best pricing, good terms"}',
 'completed',
 '2024-01-17 11:15:00');

-- Update RFP status
UPDATE rfps SET status = 'sent', updated_at = CURRENT_TIMESTAMP WHERE id IN (1, 2);

-- Add processing status example
INSERT INTO proposals (rfp_id, vendor_id, raw_email_content, email_subject, processing_status, received_at) VALUES 
(2, 3, 
 'Preparing detailed conference room proposal. Will send tomorrow. - Global IT',
 'Re: Conference Room RFP',
 'processing',
 '2024-01-12 16:45:00');
