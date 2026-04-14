# AGENTS.md - Partner Support Capability Panorama Management Platform

**Note**: This repository currently contains the requirements specification document (V1.0 Core Basic Edition). Codebase implementation has not yet begun. This file provides guidance for future development based on the specified requirements.

---

## Requirements Context

**Project**: 合作伙伴支撑能力全景管理平台 (Partner Support Capability Panorama Management Platform)
**Version**: V1.0 Core Basic Edition
**Language**: Chinese (documented), implementation language TBD
**Document**: `合作伙伴支撑能力全景管理平台需求分析文档（V1.0 核心基础版）.md`

### Core Business Modules (V1.0)

1. **开发人员管理 (Developer Management)**
   - Personnel information entry & approval
   - Skill management & matching
   - Work trajectory tracking
   - Personnel evaluation

2. **任务登记管理 (Task Registration Management)**
   - Task creation & approval
   - Task assignment to partners & developers
   - Progress tracking & delay management
   - Delivery acceptance & archiving

3. **厂商支撑能力评估 (Vendor Capability Assessment)**
   - Evaluation indicator system management
   - Assessment planning & execution
   - Auto & manual evaluation
   - Assessment report generation

4. **正向改进管理 (Positive Improvement Management)**
   - Improvement requirement initiation (auto/manual)
   - Improvement plan management
   - Progress tracking
   - Acceptance & loop closure

5. **风险库管理 (Risk Library Management)**
   - Risk entry & classification
   - Risk grading

6. **系统基础功能 (System Foundation)**
   - User management (RBAC)
   - Role & permission management
   - User information management

---

## Development Guidelines (For Future Implementation)

### Technology Stack Selection

When implementing this platform, consider:
- **Backend**: Node.js/Express, Python/FastAPI, or Java/Spring Boot
- **Frontend**: React/Vue/Angular with modern component library
- **Database**: PostgreSQL/MySQL for relational data, with consideration for audit trails
- **Authentication**: JWT + RBAC (as specified in requirements)
- **File Storage**: For attachments (certificates, resumes, documents)

### Build Commands (To Be Defined)

```bash
# Development server
npm run dev  # or python manage.py runserver

# Build for production
npm run build  # or similar

# Linting
npm run lint  # or flake8, pylint

# Testing
npm run test           # Run all tests
npm run test:unit      # Unit tests only
npm run test:integration # Integration tests only
npm run test:watch     # Watch mode
npm run test:coverage  # With coverage report
```

### Code Style Guidelines (To Be Established)

#### General Principles
- Follow language-specific best practices
- Use consistent formatting across the codebase
- Maintain comprehensive test coverage (target: 80%+)
- Document public APIs and complex business logic
- Use meaningful variable/function names that reflect domain concepts

#### Naming Conventions
- **Business entities**: Use Chinese domain terms in code comments, English in code
  - Example: `developerManagement`, `taskRegistration`, `vendorAssessment`
- **API endpoints**: RESTful conventions with clear intent
  - `GET /api/developers`, `POST /api/tasks`, `PUT /api/improvements/:id`
- **Database tables**: Snake_case with meaningful prefixes
  - `dev_personnel`, `task_registrations`, `vendor_assessments`

#### Error Handling
- Use consistent error response format:
  ```json
  {
    "code": "VALIDATION_ERROR",
    "message": "Skill information is required",
    "details": { "field": "skills" }
  }
  ```
- Implement proper HTTP status codes (400, 401, 403, 404, 500)
- Log errors with sufficient context for debugging
- Never expose sensitive information in error messages

#### Import Organization
- Group imports: Third-party libraries → Internal modules → Relative imports
- Use absolute imports from a well-defined source root
- Avoid circular dependencies

#### Type Safety
- Use TypeScript for strict typing (if Node.js)
- Use Pydantic/Type Hints for Python
- Define interfaces/types for all API contracts
- Validate all inputs at API boundaries

### Key Implementation Considerations

1. **Audit Trail**: All modifications to business entities must be tracked (who, when, what changed)
2. **Approval Workflows**: Implement flexible approval mechanism for tasks, personnel, and improvements
3. **Notifications**: System must notify relevant users at key milestones
4. **Data Integrity**: Ensure referential integrity for relationships (partner → developer → task)
5. **Soft Deletes**: Use soft deletes for historical data preservation
6. **Bulk Operations**: Support batch imports/exports where specified in requirements

### Testing Strategy

- **Unit Tests**: Business logic, utility functions, data models
- **Integration Tests**: API endpoints, database operations
- **E2E Tests**: Critical user flows (task creation → assignment → completion)
- **Test Data**: Seed test data reflecting real-world scenarios

### Security Requirements

- **RBAC Enforcement**: Strict permission checks at API and UI levels
- **Data Isolation**: Partners should only access their own data
- **Input Validation**: Validate all user inputs against business rules
- **File Upload Security**: Validate file types, scan for malware, limit sizes
- **SQL Injection Prevention**: Use parameterized queries or ORM
- **Session Management**: Secure token handling, proper logout

---

## Project Setup Instructions (When Ready)

```bash
# Initial setup
git clone <repository-url>
cd hzhb

# Install dependencies
npm install  # or pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with database credentials, etc.

# Initialize database
npm run db:migrate  # or python manage.py migrate

# Start development
npm run dev
```

---

## Getting Started with Development

1. **Read the requirements document thoroughly**: Understand all business flows and constraints
2. **Choose your tech stack**: Based on team expertise and project requirements
3. **Design your data model**: ER diagram reflecting all entities and relationships
4. **Implement RBAC**: Foundation for all authorization
5. **Develop iteratively**: Start with core modules (user management → developers → tasks)
6. **Add comprehensive tests**: Before adding new features
7. **Document as you go**: API documentation, architecture decisions, deployment guides

---

## Notes for AI Agents

- This is a Chinese business requirements document. Use Chinese terms in business logic context.
- The requirements specify RBAC - implement this before any business features.
- Many features require approval workflows - design a reusable approval mechanism.
- Audit trails are critical - track all state changes with timestamps and user context.
- When uncertain about business logic, consult the requirements document first.
- Maintain consistency with the terminology used in the requirements document.

---

**Last Updated**: 2026-04-12
**Status**: Planning Phase - No Code Implementation Yet
