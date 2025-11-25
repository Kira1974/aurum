# 📜 Changelog

This project follows **Semantic Versioning (SemVer)** for versioning.  
The version format is **X.Y.Z**, where:

- **Major (X.0.0):** Backward-incompatible changes. Example: framework or dependency upgrades.
- **Minor (0.Y.0):** Backward-compatible functionality additions or improvements. Example: new features, refactors, or
  performance improvements.
- **Patch (0.0.Z):** Backward-compatible bug fixes. Example: bug fixes, documentation updates.

Here you can check the changes between the different versions of **aurum**:

---

### [v1.1.0](./v1.1.0.md) — 2025-09-17

This release introduces **code organization improvements** to the initial DDD structure, including:

- Clearer separation of responsibilities in each layer.
- Introduction of `mappings/` for DTO ↔ Entity and DomainEvent ↔ IntegrationEvent conversions.
- More consistent naming conventions across `dto/`, `contracts/`, `models/`, and `entities/`.
- Better alignment with common DDD practices for NestJS.
- Health check endpoint to verify the microservice status.
- Testing structure: Added initial setup for unit and integration tests across layers.
- Pre-commit hook requirement: All projects must now include a versioned pre-commit hook under the `githooks/` folder.
  This hook enforces linting, formatting, and unit tests before any commit is accepted.
- Environment variables management: Defined with **dotenv** and validated with **Joi** to ensure the application does
  not start if the variables are invalid or missing.

---

### [v1.0.0](./v1.0.0.md) — 2025-09-04

This first release provides the **base DDD architecture template** for NestJS, including:

- Independent domain layer with entities, services, and events.
- Application layer with DTOs, contracts, and use cases.
- Infrastructure layer with persistence and providers.
- Interface layer for Controllers and gRPC endpoints.
- Shared utilities (`tokens`, `result`, `events`).
