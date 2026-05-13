# Codex Project Guide

This repository is a reusable Codex template for 0-to-1 Java full-stack projects.
Use this file as the main project instruction source.

## Default Stack

### Backend

- Java 17+
- Spring Boot 3
- Maven
- MyBatis-Plus for simple CRUD
- XML mapper SQL for joins, aggregations, dynamic SQL, reporting, and performance-sensitive queries
- Spring Validation for request validation
- Spring Security + JWT when authentication is needed
- WebSocket only when requirements need realtime push
- Backend root: `backend/`

### Frontend

- React + TypeScript + Next.js App Router
- Tailwind CSS + shadcn/ui
- TanStack Query for server state
- Zustand for cross-page client state
- React Hook Form + Zod for forms
- Frontend root: `frontend/`
- Before UI work, read `DESIGN.md`

### Infrastructure

- PostgreSQL by default unless the project explicitly chooses another database
- Redis only when there is a concrete need: session support, hot data, rate limiting, idempotency, temporary tokens, or distributed coordination
- RabbitMQ only when there is a concrete need: async decoupling, delayed tasks, retryable events, reliable notification delivery, or peak shaving
- Nginx as the unified entry point:
  - `/` -> frontend
  - `/api/` -> backend
  - `/ws/` -> backend WebSocket endpoint when realtime is included
- Docker Compose for local development services

## Repository Layout

Use these top-level directories when the real project starts:

```text
backend/       Spring Boot application
frontend/      Next.js application
docs/          requirements, architecture, API, database, alignment docs
scripts/       local automation scripts
```

## Core Workflow

1. Start from `main` and create a feature branch:

   ```powershell
   git switch -c feature/<name>
   ```

2. Understand the existing code and documents before editing.
3. For frontend work, read `DESIGN.md` before implementation.
4. Keep API, database, frontend, and WebSocket contracts aligned through docs.
5. Implement one runnable phase or vertical slice at a time.
6. After Java edits, format changed Java files with:

   ```powershell
   .\scripts\format-java.ps1 <path-to-java-file-or-directory>
   ```

7. Before commit, run focused tests, inspect `git diff`, then review only the current diff.
8. After staging Java files, run:

   ```powershell
   .\scripts\format-staged-java.ps1
   git add .
   git diff --cached
   ```

9. Use conventional commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`, `perf:`, `ci:`.
10. Do not commit directly to `main`.

## Codex Working Modes

Codex should treat the following sections as role playbooks.

### Architect Mode

Use for system architecture only. Do not write business code.

Output architecture documents under `docs/系统架构/`:

- `01-系统整体架构.md`
- `02-前后端模块划分.md`
- `03-后端包结构.md`
- `04-前端目录结构.md`
- `05-数据库选型与核心表方向.md`
- `06-缓存设计.md`
- `07-消息队列设计.md`
- `08-API设计原则.md`
- `09-权限与安全设计.md`
- `10-Nginx反向代理设计.md`
- `11-实时通信设计.md`
- `12-后续实施阶段拆分.md`

Do not design detailed API fields, DDL, indexes, frontend wireframes, or implementation task lists in architecture mode.

### Database Designer Reviewer Mode

Use for database design and database risk review.

- Choose PostgreSQL by default unless the project chooses otherwise.
- MyBatis-Plus can operate PostgreSQL or MySQL.
- Design tables, relationships, indexes, constraints, enums/statuses, audit fields, soft delete strategy, and migration risks.
- Complex SQL should be written in XML mapper later during implementation.
- Do not assume Supabase, RLS, JPA, or Hibernate unless explicitly requested.

### API Designer Mode

Use for REST API contract design.

- Base path: `/api/v1`
- Use plural noun resources.
- Use JWT in `Authorization: Bearer <token>` when auth exists.
- Use unified response envelope:

  ```json
  {
    "code": 200,
    "message": "success",
    "data": {}
  }
  ```

- Use numeric business response codes aligned with backend `ResponseCode`.
- Default pagination: `page` + `size`, response contains `total` + `list`.
- Use cursor pagination only for feeds, timelines, infinite scroll, or high-volume append-only data.
- Do not expose database entities directly.
- If WebSocket exists, clearly separate REST APIs from realtime events.
- Do not design GraphQL, HATEOAS, OAuth2, SDKs, or webhooks unless explicitly requested.

### Spring Boot Developer Mode

Use for backend implementation.

- Put backend code under `backend/`.
- Prefer module-first package structure for real business systems.
- Use DTOs for requests and VO/response records for responses.
- Do not return entity objects to the frontend.
- Put transactions at service boundaries.
- Validate external input at controllers or API boundaries.
- Use MyBatis-Plus for simple CRUD.
- Use XML mapper for complex SQL.
- Keep WebSocket as a delivery channel, not the source of truth.
- Run Maven tests after backend work:

  ```powershell
  if (Test-Path .\backend\mvnw.cmd) { .\backend\mvnw.cmd test } else { mvn -f .\backend\pom.xml test }
  ```

### Frontend Implementer Mode

Use for frontend implementation.

- Put frontend code under `frontend/`.
- Read `DESIGN.md` before UI work.
- Follow `docs/前端设计文档.md`, `docs/API设计文档.md`, and `docs/前后端接口对齐文档.md` when they exist.
- Define typed request params and response types for every API used.
- Cover loading, empty, error, success, and submitting states where applicable.
- Do not invent API fields. Report contract gaps first.
- If WebSocket is included, connect through `/ws/` and gracefully degrade when disconnected.
- Run existing lint/test/build commands after frontend work.

### Planner Mode

Use for implementation planning only.

- Read requirements, architecture, API, database, frontend design, and alignment docs.
- Output `开发任务计划.md`.
- Split by runnable vertical phases, not by large technical layers.
- Each phase should include backend, frontend, database, Nginx/Docker/config, verification, dependencies, parallelization, and risks.
- Do not put all features into one phase.

### Before Commit Reviewer Mode

Use before committing.

- Do not modify files.
- Run `git status`, `git diff`, and available focused tests.
- Review only the current diff, not the entire project.
- For Maven projects, prefer `.\mvnw.cmd test`; otherwise use `mvn test` or `mvn -f backend/pom.xml test` as appropriate.
- Check Java/Spring, MyBatis-Plus/XML SQL, transactions, validation, test coverage, security risks, and unrelated changes.
- Report findings as P0/P1/P2/P3.
- If there are no blocking issues, say clearly that it is ready for `git add`, `git diff --cached`, and `git commit`.

## Backend Package Guidance

Prefer module-first for real business systems:

```text
backend/src/main/java/com/yourcompany/project/
  common/
    config/
    constant/
    enums/
    exception/
    response/
    utils/
    security/
    redis/
    openapi/
    aspect/
  infrastructure/
    persistence/
    mq/
    storage/
    external/
  modules/
    auth/
      controller/
      service/
      dto/
      vo/
      mapper/
      entity/
      convert/
      event/
    user/
      controller/
      service/
      dto/
      vo/
      mapper/
      entity/
      convert/
      event/
  job/
  script/
  Application.java
```

Layer-first is acceptable only for tiny or short-lived projects:

```text
backend/src/main/java/com/example/project/
  controller/
  service/
  mapper/
  entity/
  dto/
  vo/
  config/
  exception/
  common/
  util/
```

## Safety Rules

- Never read or print `.env`, secret files, credentials, private keys, or token files.
- Never commit `.env`.
- Do not run destructive git commands such as `git reset --hard` or `git checkout --` unless explicitly requested.
- Do not revert user changes.
- Do not invent API/database/frontend fields when contract docs exist.
- Prefer `rg` for searching.
- Use focused tests first, then broader tests when the blast radius is larger.
