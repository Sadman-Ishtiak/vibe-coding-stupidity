# Application Security Audit Report

This report details the security measures implemented within the InternNova application (`client` and `server`), analyzing the codebase for defenses against common web vulnerabilities.

## 1. Authentication and Session Management

The application employs a robust, stateless authentication mechanism designed to secure user identities and sessions.

*   **Dual-Token Architecture (JWT):**
    *   **Access Tokens:** Short-lived (15 minutes), signed JSON Web Tokens (JWT) are used for API authorization. They are transmitted in the `Authorization: Bearer` header, minimizing the window of opportunity if a token is compromised.
    *   **Refresh Tokens:** Long-lived (7 days) tokens are used solely to obtain new access tokens.
*   **Secure Cookie Storage:**
    *   Refresh tokens are stored in **HTTPOnly** cookies. This prevents client-side scripts (XSS attacks) from accessing the refresh token.
    *   Cookies are configured with `SameSite=Strict` to mitigate Cross-Site Request Forgery (CSRF) and `Secure` (in production) to ensure transmission only over HTTPS.
*   **Token Rotation:**
    *   The `/refresh-token` endpoint implements **Token Rotation**. When a refresh token is used, it is invalidated and replaced with a new one. This helps detect token theft; if an attacker tries to reuse an old refresh token, the server can detect the anomaly and revoke all access.
*   **Password Security:**
    *   **Bcrypt Hashing:** Passwords are hashed using `bcryptjs` with a salt round of 10 via a Mongoose pre-save hook (`User.js`). Plain-text passwords are never stored in the database.
    *   **Reset Token Hashing:** Password reset tokens are generated using crypto-random strings. Crucially, they are **hashed (SHA-256)** before being stored in the database (`authController.js`). Even if the database is leaked, the raw tokens needed to reset passwords remain secure.

## 2. Authorization and Access Control

Role-Based Access Control (RBAC) is enforced at multiple layers to ensure users can only access resources permitted by their role (`candidate` or `recruiter`).

*   **Middleware Enforcement:**
    *   `authMiddleware.js`: Verifies the validity of the JWT access token.
    *   `roleMiddleware.js`: Provides specific guards like `isRecruiter` and `isCandidate`.
    *   **Dedicated Middleware:** Specialized middleware (`candidateAuthMiddleware.js`, `companyAuthMiddleware.js`) adds an extra layer of security by explicitly checking the user's role against the JWT payload *and* the database record, preventing privilege escalation attacks where a user might manipulate their token payload.
*   **Resource Ownership:**
    *   Controllers (e.g., `jobController.js`, `applicationController.js`) explicitly verify ownership before modification or deletion. For example, a recruiter cannot delete a job they did not post, as the system checks `job.company.toString() !== req.user._id.toString()`.

## 3. Input Validation and Data Integrity

The application aggressively sanitizes and validates inputs to prevent injection attacks and ensure data consistency.

*   **Express-Validator:**
    *   Routes (`authRoutes.js`, `jobRoutes.js`) use `express-validator` to enforce strict rules on inputs (e.g., email format, password complexity, string length). Requests with invalid data are rejected before reaching business logic.
*   **Strict Typing & Whitelisting:**
    *   `districtValidator.js` ensures location fields only contain valid Bangladesh districts, preventing garbage data or injection strings in location fields.
    *   `uploadMiddleware.js` uses `multer` with a file filter to strictly allow only specific MIME types (images for profiles, PDFs for resumes), preventing the upload of executable scripts.
*   **MongoDB ID Validation:**
    *   Controllers manually validate `_id` parameters using regex (`/^[0-9a-fA-F]{24}$/`) to prevent NoSQL injection vectors that rely on malformed IDs.

## 4. File Upload Security

File handling is a critical attack surface, managed here with several layers of defense:

*   **Image Processing (Sharp):**
    *   The `imageResize.js` middleware re-processes uploaded images using `sharp`. This effectively **sanitizes** the file by stripping metadata (EXIF) and reconstructing the image data. This neutralizes "polyglot" files where malicious code is hidden inside valid image headers.
*   **File Cleanup:**
    *   The application implements automatic cleanup logic. If a database operation fails after a file upload, or if validation fails, the `fs.unlinkSync` method is triggered to remove the orphaned file, preventing storage exhaustion attacks.

## 5. Security Misconfiguration & Exposure Prevention

*   **Secure Error Handling:**
    *   `errorMiddleware.js` ensures that stack traces are *only* sent in the `development` environment. In production, users receive generic error messages, preventing information leakage about server internals.
*   **Environment Validation:**
    *   `validateEnv.js` runs at startup to ensure critical security keys (`JWT_SECRET`, `JWT_REFRESH_SECRET`) are present and meet complexity requirements (checking for weak secrets).
*   **Sensitive Data Redaction:**
    *   `authLogger.js` intercepts logs to redact sensitive fields (passwords, tokens) before printing to the console, preventing credentials from leaking into server logs.

## 6. Anti-Automation & Brute Force Protection

*   **Rate Limiting:**
    *   `rateLimitMiddleware.js` implements an in-memory counter to limit requests to sensitive endpoints.
    *   `/forgot-password` is limited to 5 requests per 15 minutes.
    *   `/reset-password` is limited to 10 requests per 15 minutes.
*   **Timing Attack Mitigation:**
    *   The `forgotPassword` controller uses a simulated delay (`setTimeout`) when an email is not found. This ensures the response time is consistent whether the user exists or not, preventing attackers from enumerating valid email addresses based on server response time.

## 7. Vulnerability Mitigation Summary

| Vulnerability | Status | Mitigation Strategy implemented |
| :--- | :--- | :--- |
| **SQL/NoSQL Injection** | **Mitigated** | Mongoose ODM sanitization, explicit ID validation, type casting. |
| **XSS (Cross-Site Scripting)** | **Mitigated** | React auto-escaping, HttpOnly cookies for tokens, input trimming. |
| **CSRF** | **Mitigated** | `SameSite=Strict` cookies, CORS configuration with specific origin. |
| **Broken Authentication** | **Mitigated** | JWT rotation, weak password checks, rate limiting on login/reset. |
| **Sensitive Data Exposure** | **Mitigated** | Bcrypt password hashing, SHA-256 token hashing, production error masking. |
| **Privilege Escalation** | **Mitigated** | Server-side role checks, resource ownership verification on every write/delete. |
| **Malicious File Upload** | **Mitigated** | File extension validation, MIME type checking, Image reconstruction (stripping malware). |
