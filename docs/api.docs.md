# AI-Powered RFP Management System - API Documentation

Base URL: `http://localhost:5000/api`

## Authentication
Currently no authentication required (single-user system).

---

## RFP Endpoints

### Create RFP
**POST** `/rfps`

Creates a new RFP from natural language description using AI.

**Request Body:**
```json
{
  "description": "Need 25 laptops: Intel i5+, 16GB RAM, 512GB SSD, Win11 Pro. Budget Rs 42L, 30 days delivery."
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Office Laptop Procurement",
  "description": "Need 25 laptops: Intel i5+, 16GB RAM, 512GB SSD, Win11 Pro. Budget Rs 42L, 30 days delivery.",
  "structured_requirements": {
    "items": [{"name": "Business Laptops", "quantity": 25, "specifications": "Intel i5+, 16GB RAM, 512GB SSD"}],
    "budget": {"max": 4200000, "currency": "INR"},
    "timeline": {"deadline": "2024-02-15"},
    "terms": {"payment": "Net 30", "warranty": "3 years"}
  },
  "status": "draft",
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

### Get All RFPs
**GET** `/rfps`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Office Laptop Procurement",
    "status": "draft",
    "created_at": "2024-01-15T10:00:00.000Z"
  }
]
```

### Get RFP by ID
**GET** `/rfps/:id`

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "title": "Office Laptop Procurement",
  "description": "Need 25 laptops...",
  "structured_requirements": "{...}",
  "status": "draft"
}
```

### Update RFP
**PUT** `/rfps/:id`

**Request Body:**
```json
{
  "title": "Updated RFP Title",
  "description": "Updated description",
  "status": "sent"
}
```

### Delete RFP
**DELETE** `/rfps/:id`

**Response:** `204 No Content`

### Send RFP to Vendors
**POST** `/rfps/send`

**Request Body:**
```json
{
  "rfpId": 1,
  "vendorIds": [1, 2, 3]
}
```

**Response:**
```json
{
  "message": "RFP sent successfully",
  "rfpVendors": [
    {
      "id": 1,
      "rfp_id": 1,
      "vendor_id": 1,
      "email_status": "pending"
    }
  ]
}
```

### Get RFP Vendors
**GET** `/rfps/:id/vendors`

**Response:**
```json
[
  {
    "id": 1,
    "vendor_name": "TechCorp Solutions",
    "vendor_email": "sales@techcorp.com",
    "email_status": "sent",
    "sent_at": "2024-01-15T10:00:00.000Z"
  }
]
```

### Get RFP Proposals
**GET** `/rfps/:id/proposals`

**Response:**
```json
[
  {
    "id": 1,
    "vendor_id": 1,
    "structured_proposal": "{\"pricing\":{\"total\":52500}}",
    "ai_scores": "{\"overall_score\":9.0}",
    "processing_status": "completed"
  }
]
```

### Compare Proposals
**GET** `/rfps/:id/compare`

**Response:**
```json
{
  "summary": "3 proposals received with varying pricing and delivery terms",
  "recommendation": {
    "vendor_id": 1,
    "reason": "Best overall value with competitive pricing and fast delivery"
  },
  "rankings": [
    {"vendor_id": 1, "rank": 1, "score": 9.0},
    {"vendor_id": 2, "rank": 2, "score": 8.7}
  ]
}
```

---

## Vendor Endpoints

### Create Vendor
**POST** `/vendors`

**Request Body:**
```json
{
  "name": "TechCorp Solutions",
  "email": "sales@techcorp.com",
  "phone": "+91-98765-43210",
  "category": "Technology"
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 1,
  "name": "TechCorp Solutions",
  "email": "sales@techcorp.com",
  "phone": "+91-98765-43210",
  "category": "Technology",
  "created_at": "2024-01-15T10:00:00.000Z"
}
```

### Get All Vendors
**GET** `/vendors`

Query Parameters:
- `category` (optional): Filter by category

**Response:**
```json
[
  {
    "id": 1,
    "name": "TechCorp Solutions",
    "email": "sales@techcorp.com",
    "category": "Technology"
  }
]
```

### Get Vendor by ID
**GET** `/vendors/:id`

### Update Vendor
**PUT** `/vendors/:id`

**Request Body:**
```json
{
  "name": "Updated Vendor Name",
  "email": "new@email.com",
  "phone": "+91-99999-88888",
  "category": "Updated Category"
}
```

### Delete Vendor
**DELETE** `/vendors/:id`

---

## Proposal Endpoints

### Create Proposal
**POST** `/proposals`

**Request Body:**
```json
{
  "rfp_id": 1,
  "vendor_id": 1,
  "raw_email_content": "Dell Latitude laptops, Rs 43,57,500 total, 21 days delivery...",
  "email_subject": "Re: Laptop RFP Response"
}
```

**Response:**
```json
{
  "id": 1,
  "rfp_id": 1,
  "vendor_id": 1,
  "raw_email_content": "Dell Latitude laptops...",
  "processing_status": "pending",
  "received_at": "2024-01-16T09:30:00.000Z"
}
```

### Get Proposals by RFP
**GET** `/proposals/rfp/:rfpId`

### Get Proposal by ID
**GET** `/proposals/:id`

### Process Proposal (AI Parsing)
**POST** `/proposals/:id/process`

Triggers AI processing to parse raw email into structured data.

**Response:**
```json
{
  "id": 1,
  "structured_proposal": {
    "pricing": {"total": 4357500, "per_unit": 174300},
    "timeline": {"delivery_date": "2024-02-12"},
    "terms": {"payment": "Net 30", "warranty": "3-year"}
  },
  "ai_scores": {
    "price_score": 8.5,
    "timeline_score": 9.0,
    "overall_score": 9.0,
    "analysis": "Good pricing, fast delivery"
  },
  "processing_status": "completed"
}
```

### Reprocess Proposal
**POST** `/proposals/:id/reprocess`

### Process All Pending Proposals
**POST** `/proposals/process-pending`

**Response:**
```json
{
  "message": "Processing completed",
  "results": [
    {"status": "fulfilled", "value": 1},
    {"status": "rejected", "error": "AI parsing failed"}
  ]
}
```

### Delete Proposal
**DELETE** `/proposals/:id`

---

## Email System Endpoints

### Handle Inbound Email
**POST** `/email/inbound`

Processes incoming vendor emails and creates proposals automatically.

**Request Body:**
```json
{
  "from": "vendor@example.com",
  "subject": "Re: RFP 1 - Laptop Proposal",
  "text": "Dell laptops (25 units): Rs 43,57,500 total. Delivery: 21 days. RFP ID: 1, Vendor ID: 1",
  "html": "<p>Dell laptops proposal...</p>"
}
```

**Response:**
```json
{
  "message": "Email received and proposal created",
  "proposal_id": 1,
  "status": "processing"
}
```

### Test Email Connection
**GET** `/email/test-connection`

**Response:**
```json
{
  "smtp": true
}
```

### Start Email Monitoring
**POST** `/email/monitoring/start`

**Response:**
```json
{
  "message": "Email monitoring started",
  "status": "active"
}
```

### Stop Email Monitoring
**POST** `/email/monitoring/stop`

### Get Email Status
**GET** `/email/status/:messageId`

**Response:**
```json
{
  "message_id": "msg123",
  "status": "delivered",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

---

## Health Check

### Health Status
**GET** `/health`

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-01-15T10:00:00.000Z"
}
```

---

## Error Responses

All endpoints return consistent error format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

---

## Testing with Postman

### Environment Variables
Create a Postman environment with:
- `baseUrl`: `http://localhost:5000/api`

### Sample Test Flow

1. **Create Vendor:**
   ```
   POST {{baseUrl}}/vendors
   Body: {"name": "Test Vendor", "email": "test@vendor.com", "phone": "+91-98765-43210", "category": "Technology"}
   ```

2. **Create RFP:**
   ```
   POST {{baseUrl}}/rfps
   Body: {"description": "Need 10 laptops, budget Rs 20L, 2 weeks delivery"}
   ```

3. **Send RFP:**
   ```
   POST {{baseUrl}}/rfps/send
   Body: {"rfpId": 1, "vendorIds": [1]}
   ```

4. **Create Proposal:**
   ```
   POST {{baseUrl}}/proposals
   Body: {"rfp_id": 1, "vendor_id": 1, "raw_email_content": "HP laptops Rs 15L, 10 days delivery", "email_subject": "RFP Response"}
   ```

5. **Process Proposal:**
   ```
   POST {{baseUrl}}/proposals/1/process
   ```

6. **Compare Proposals:**
   ```


