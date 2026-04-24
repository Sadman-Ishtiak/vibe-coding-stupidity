# Project Analysis: Limitations and Future Scope

This document outlines the current technical and functional limitations of the InternNova project and proposes a roadmap for future enhancements and features.

## 1. Current Limitations

### A. Technical Limitations
1.  **Search Scalability**:
    *   **Current State:** The application uses MongoDB `RegExp` operators (`$or`, `$regex`) for keyword searching (Jobs, Companies).
    *   **Impact:** This is inefficient for large datasets and does not support features like typo tolerance, ranking, or complex weighting. It will become a performance bottleneck as the database grows.
2.  **File Storage**:
    *   **Current State:** Files (Images, Resumes) are stored locally on the server filesystem (`/uploads`).
    *   **Impact:** This prevents horizontal scaling (adding more servers) because files are not shared between instances. It also risks data loss if the server disk fails. It is not suitable for ephemeral hosting platforms (like Heroku, Vercel, or AWS Lambda).
3.  **Email System**:
    *   **Current State:** The email service (`utils/emailService.js`) is currently a placeholder that logs emails to the console. `nodemailer` is not installed/configured.
    *   **Impact:** Users cannot receive real password reset emails or notifications.
4.  **Lack of Caching**:
    *   **Current State:** All requests (e.g., fetching job lists, user profiles) hit the database directly.
    *   **Impact:** High database load under traffic. Static data (like Categories or Locations) should be cached.
5.  **Testing Strategy**:
    *   **Current State:** There are some shell scripts for basic API testing, but no comprehensive Unit Tests (Jest/Mocha) or Integration Tests.
    *   **Impact:** High risk of regression bugs when modifying code. Hard to maintain reliability.

### B. Functional Limitations
1.  **No Real-Time Features**:
    *   **Current State:** No WebSocket implementation (`socket.io`).
    *   **Impact:** No real-time notifications for application updates or direct messaging between Recruiters and Candidates.
2.  **No Super-Admin Role**:
    *   **Current State:** The system only supports `Candidate` and `Recruiter` roles.
    *   **Impact:** There is no interface for platform administrators to ban abusive users, moderate job postings, or manage site-wide settings.
3.  **No Social Authentication**:
    *   **Current State:** Only email/password login is supported.
    *   **Impact:** Higher friction for user onboarding compared to "Login with Google/LinkedIn".

---

## 2. Future Scope & Roadmap

### Phase 1: Infrastructure & Stability (Immediate)
*   **Cloud Storage Integration:** Migrate file uploads to **AWS S3**, **Cloudinary**, or **Firebase Storage** to enable stateless deployments.
*   **Email Service:** Implement **SendGrid**, **Mailgun**, or **AWS SES** for reliable transactional emails.
*   **Containerization:** Add a `Dockerfile` and `docker-compose.yml` to standardize development and deployment environments.
*   **Automated Testing:** Set up **Jest** and **Supertest** for backend API testing.

### Phase 2: Feature Enhancement (Short-term)
*   **Advanced Search Engine:** Integrate **ElasticSearch** or **Algolia** to provide fast, full-text search with facets and filters.
*   **Social Login (OAuth):** Implement **Passport.js** strategies for Google and LinkedIn login.
*   **Application Tracking System (ATS) Lite:**
    *   Allow recruiters to move candidates through custom stages (e.g., "Phone Screen", "Technical Interview").
    *   Add "Notes" feature for recruiters on specific applications.

### Phase 3: Advanced Features (Long-term)
*   **Real-Time Chat System:**
    *   Implement **Socket.io** to allow recruiters to chat directly with shortlisted candidates.
*   **AI/ML Integration:**
    *   **Resume Parser:** Automatically extract skills and experience from PDF resumes using NLP.
    *   **Job Recommendations:** Suggest jobs to candidates based on their profile similarity to job descriptions.
*   **Monetization:**
    *   **Stripe/PayPal Integration:** Allow recruiters to pay for "Featured" job posts or access to premium candidate databases.
*   **Analytics Dashboard:**
    *   Provide recruiters with charts showing views, click-through rates, and application trends over time.

---

## 3. Architecture Proposal for Scale

```mermaid
graph TD
    Client[React Frontend] --> LB[Load Balancer]
    LB --> API1[Node.js API 1]
    LB --> API2[Node.js API 2]
    API1 --> Redis[Redis Cache]
    API1 --> DB[(MongoDB Cluster)]
    API1 --> Search[(ElasticSearch)]
    API1 --> S3[Cloud Storage]
    API1 --> Queue[Message Queue (RabbitMQ/Bull)]
    Queue --> Worker[Background Worker (Emails/PDF Parsing)]
```
