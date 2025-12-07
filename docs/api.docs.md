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


---

# Backend Architecture & Implementation

## System Overview

The AI-Powered RFP Management System follows a **layered architecture** pattern with clear separation of concerns:

```
┌─────────────────┐
│   Frontend      │ ← React UI (Port 3000)
└─────────────────┘
         ↓ HTTP/REST
┌─────────────────┐
│   API Layer     │ ← Express Routes & Controllers
└─────────────────┘
         ↓
┌─────────────────┐
│ Business Logic  │ ← Services & AI Integration
└─────────────────┘
         ↓
┌─────────────────┐
│   Data Layer    │ ← Models & Database
└─────────────────┘
         ↓
┌─────────────────┐
│  PostgreSQL DB  │ ← Persistent Storage
└─────────────────┘
```

## Directory Structure

```
backend/
├── src/
│   ├── controllers/     # HTTP request handlers
│   ├── services/        # Business logic & AI integration
│   ├── models/          # Database models & ORM
│   ├── routes/          # API route definitions
│   ├── middleware/      # Cross-cutting concerns
│   ├── utils/           # Helper functions
│   ├── app.js          # Express app configuration
│   └── database.js     # Database connection
├── server.js           # Application entry point
└── .env               # Environment configuration
```

## Core Components

### 1. **Models Layer**
Handles data persistence and database operations:

- **User.js** - User management and authentication
- **Vendor.js** - Vendor CRUD with category filtering
- **RFP.js** - RFP lifecycle management
- **Proposal.js** - Proposal processing and AI integration
- **RFPVendor.js** - Many-to-many relationship management

**Key Features:**
- PostgreSQL integration using `pg` driver
- Class-based models with static and instance methods
- Relationship management between entities
- Built-in validation and error handling

### 2. **Services Layer**
Contains business logic and external integrations:

#### **AI Service (`aiService.js`)**
- **RFP Generation**: Converts natural language to structured JSON
- **Proposal Parsing**: Extracts structured data from email content
- **Scoring Algorithm**: AI-powered proposal evaluation
- **Comparison Engine**: Multi-proposal analysis and recommendations
- **Provider**: Groq (free tier) with Llama 3.1 model

#### **RFP Service (`rfpService.js`)**
- RFP lifecycle management (draft → sent → completed)
- Vendor assignment and notification
- Proposal aggregation and comparison
- Status tracking and updates

#### **Vendor Service (`vendorService.js`)**
- Vendor onboarding and management
- Category-based filtering
- Validation and duplicate prevention

#### **Proposal Service (`proposalService.js`)**
- Email content processing
- AI parsing workflow management
- Batch processing capabilities
- Error handling and retry logic

### 3. **Controllers Layer**
HTTP request/response handling:

- **Input validation** and sanitization
- **Error handling** with consistent response format
- **Status code management** (200, 201, 400, 404, 500)
- **Request routing** to appropriate services
- **Response formatting** for frontend consumption

### 4. **Routes Layer**
API endpoint organization:

```javascript
/api/vendors     # Vendor management
/api/rfps        # RFP operations
/api/proposals   # Proposal processing
/api/health      # System status
```

### 5. **Middleware Layer**
Cross-cutting concerns:

- **CORS handling** for frontend integration
- **Error middleware** for consistent error responses
- **Request logging** for debugging and monitoring
- **JSON parsing** with size limits
- **Input validation** and sanitization

## Database Schema

### **Core Tables:**
- `users` - System users (single-user for now)
- `vendors` - Vendor information and categories
- `rfps` - RFP details with AI-generated structure
- `proposals` - Vendor responses with AI parsing
- `rfp_vendors` - Junction table for RFP-vendor relationships

### **Key Features:**
- **JSONB columns** for structured AI data storage
- **Foreign key constraints** for data integrity
- **Indexes** for query performance
- **Timestamps** for audit trails

## AI Integration Workflow

### **1. RFP Creation Flow:**
```
User Input → AI Service → Structured JSON → Database
"Need laptops" → Groq API → {items, budget, timeline} → PostgreSQL
```

### **2. Proposal Processing Flow:**
```
Email Content → AI Parsing → Structured Data → Scoring → Storage
"Dell laptops $50k" → Extract pricing → JSON format → Score 8.5/10 → DB
```

### **3. Comparison Flow:**
```
Multiple Proposals → AI Analysis → Rankings → Recommendation
[Proposal A, B, C] → Compare features → [1st, 2nd, 3rd] → "Choose A"
```

## Error Handling Strategy

### **Layered Error Handling:**
1. **Model Level**: Database constraint violations
2. **Service Level**: Business logic errors
3. **Controller Level**: HTTP status and formatting
4. **Middleware Level**: Global error catching

### **Error Response Format:**
```json
{
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

## Performance Optimizations

### **Database:**
- **Indexes** on foreign keys and frequently queried columns
- **JSONB indexes** for AI data queries
- **Connection pooling** for concurrent requests

### **API:**
- **Request size limits** (10MB) for security
- **Async/await** for non-blocking operations
- **Batch processing** for multiple proposals

### **AI Integration:**
- **Timeout handling** for AI API calls
- **Retry logic** for failed AI processing
- **Caching** for repeated AI operations (future enhancement)

## Security Considerations

### **Input Validation:**
- Email format validation
- Required field checking
- JSON structure validation
- SQL injection prevention

### **Data Protection:**
- Environment variable configuration
- API key security
- CORS policy enforcement
- Request size limiting

## Scalability Design

### **Current Architecture:**
- Single-user system
- Direct database connections
- Synchronous AI processing

### **Future Enhancements:**
- Multi-tenant support
- Queue-based AI processing
- Caching layer (Redis)
- Load balancing
- Microservices architecture

## Development Workflow

### **Local Development:**
1. PostgreSQL database setup
2. Environment configuration
3. Dependency installation
4. Database migration
5. Seed data loading
6. Server startup

### **Testing Strategy:**
- Unit tests for services
- Integration tests for API endpoints
- Postman collections for manual testing
- Database transaction rollback for test isolation

## Monitoring & Logging

### **Current Implementation:**
- Console logging for requests
- Error logging with stack traces
- Database connection monitoring

### **Production Considerations:**
- Structured logging (JSON format)
- Log aggregation (ELK stack)
- Performance monitoring
- Health check endpoints
- Alerting for critical errors

This architecture provides a solid foundation for the AI-powered RFP management system with clear separation of concerns, scalability considerations, and robust error handling.