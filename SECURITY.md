# Security Architecture & Production Guidelines

This document details the frontend security posture, data handling practices, and recommended production server deployment headers for the **NCSAM Cyber Safety Pledge** application.

---

## 1. Frontend Data Protection & Privacy Principles

- **Zero Insecure Persistence**:
  - Personal identifiable information (Name, Email, Mobile, Profession, City, Organization) is stored strictly in transient React component state memory.
  - No personal information or tokens are written to `localStorage`, `sessionStorage`, cookies, or browser caches.
- **No Sensitive Parameters in URLs**:
  - URLs remain clean and opaque (e.g. `/`, `/pledge`).
  - No email addresses, phone numbers, names, or session tokens are exposed in query strings or route paths.
- **Strict Console Hygiene**:
  - Production source code contains zero `console.log` statements of participant payloads, email addresses, or backend responses.
- **XSS Prevention**:
  - All dynamic texts (including pledge copy and user names) are rendered as plain text within React JSX bindings (`{pledgeText}`, `{participantName}`).
  - `dangerouslySetInnerHTML` is never used.
- **Duplicate Submission Guards**:
  - Both the participant registration form and the certificate generation trigger feature strict active submission locks (`disabled` attributes + loading spinners).
  - Rapid double-clicking is prevented at the UI layer while relying on the Spring Boot backend as the ultimate authority.

---

## 2. API Error Normalization & Information Disclosure Defense

- All HTTP responses from the backend flow through `src/api/client.js`.
- Errors are normalized to generic, safe user-facing notices (e.g. *"Unable to connect to the pledge service"*).
- Internal server traces, Java exceptions, SQL errors, or stack traces from Spring Boot are intercepted and never rendered to the end-user.

---

## 3. Spring Boot Backend Integration Contract

The frontend communicates with the Java Spring Boot backend via configurable REST endpoints (defined in `src/config/pledgeConfig.js`):

| Action | Method | Path | Request Body | Response Payload |
|---|---|---|---|---|
| Register Participant | `POST` | `/api/pledge/participants` | `{ name, email, mobile, profession, city, organization }` | `{ participantId, name, email }` |
| Get Dynamic Content (Optional) | `GET` | `/api/pledge/content` | *None* | `{ pledgeText, acceptanceStatements }` |
| Generate Certificate | `POST` | `/api/pledge/generate-certificate` | `{ participantId, participantName, acceptedStatementIds }` | `{ certificateId, participantName, issueDate, emailSent }` |

### Environment Configuration:
- `VITE_API_BASE_URL`: Base URL of the Spring Boot backend (default: `http://localhost:8080`).
- `VITE_ENABLE_DEV_MOCK_FALLBACK`: Set to `false` in production. Only used during development if the backend server is offline.

> [!CAUTION]
> **No Secrets in Frontend**: Never add private keys, email credentials (SMTP passwords), database credentials, or JWT signing secrets to `.env` or client code. Variables prefixed with `VITE_` are publicly accessible in browser bundles.

---

## 4. Recommended Production Server Security Headers

The frontend application cannot enforce server-level HTTP response headers on its own. It is strongly recommended that the production reverse proxy (e.g. Nginx, Cloudflare, AWS CloudFront, or Spring Boot static resource filter) enforce the following security headers:

```http
# 1. Content Security Policy (CSP)
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self' https://<your-spring-boot-api-domain>; object-src 'none'; frame-ancestors 'none';

# 2. Strict Transport Security (HSTS)
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload

# 3. Prevent MIME Type Sniffing
X-Content-Type-Options: nosniff

# 4. Frame Protection (Anti-Clickjacking)
X-Frame-Options: DENY

# 5. Referrer Policy
Referrer-Policy: strict-origin-when-cross-origin

# 6. Permissions Policy
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```
