# Paprika

[![Status](https://img.shields.io/badge/Status-Active-brightgreen)](https://tu-enlace.com)
[![Version](https://img.shields.io/badge/Version-v1.0.0-blue)](https://github.com/usuario/repositorio/releases)

**Paprika** is a repository for configuring a base template for the **Domain-Driven Design (DDD)** architecture applied
to NestJS.

---

- [Changelog](#changelog)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [Quick Start](#quick-start)
- [Development Guide](#development-guide)
- [Development](#development)
    - [Prettier](#prettier)
    - [ESLint](#eslint)
- [Testing](#testing)
    - [Coverage Thresholds](#coverage-thresholds)
    - [Pre-commit](#pre-commit)

---

# 📜 Changelog  <a name="changelog"></a>

Check [here](./documentation/changelog.md) for detailed changelog.

---

# 🏗️ Project Structure  <a name="project-structure"></a>

This project follows a modular architecture inspired by Domain-Driven Design (DDD) principles. The main folders are
organized as follows:

```
src/
├── 📦 app.module.ts
├── ⚙️ config/
│   └── 🌍 env.config.ts
├── 🛠 shared/
│   ├── 🔑 constants/
│   │   └── tokens.ts
│   └── 🧩 utils/
│       └── tracing-event.util.ts
└── 📂 modules/
    ├──  👋 hello/
    │   ├── 🧠 domain/ # Reglas de negocio puras
    │   │   ├── models/
    │   │   ├── entities/
    │   │   └── services/
    │   ├── 🎯 application/ # Orquestación de casos de uso
    │   │   ├── dto/
    │   │   ├── contracts/
    │   │   ├── use-cases/
    │   │   └── mappers/
    │   ├── 🏗 infrastructure/ # Adaptadores concretos
    │   │   ├── persistence/
    │   │   ├── providers/
    │   │   ├── events/
    │   │   └── config/
    │   └── 🌐 interface/ # Delivery (HTTP/gRPC/NATS…)
    │       ├── interceptors/ 
    │       └── grpc/
    └── 🩺 health/  

test/
└── 📂 modules/
    ├── 👋 hello/
    │   ├── 🧠 domain/
    │   │   ├── entities/
    │   │   │   └── hello.entity.spec.ts
    │   │   └── services/
    │   │       └── deposit.service.spec.ts
    │   ├── 🎯 application/
    │   │   ├── dto/
    │   │   │   └── hello.dto.spec.ts
    │   │   ├── contracts/
    │   │   │   └── hello.repository.contract.spec.ts
    │   │   └── use-cases/
    │   │       └── greeting.use-case.spec.ts
    │   ├── 🏗 infrastructure/
    │   │   ├── persistence/
    │   │   │   └── deposit.repository.spec.ts
    │   │   ├── providers/
    │   │   │   └── aldeamo.provider.spec.ts
    │   │   └── events/
    │   │       └── kafka-producer-event.spec.ts
    │   └── 🌐 interface/
    │       └── deposit.controller.spec.ts   
    └── 🩺 health/                     
```

---

# 📦 Dependencies <a name="dependencies"></a>

### ![NestJS](https://img.shields.io/badge/NestJS-v11.0.1-e0234e?logo=nestjs&logoColor=white)

Node.js framework for building efficient, scalable server-side applications.

### ![TypeScript](https://img.shields.io/badge/TypeScript-v5.7.3-3178c6?logo=typescript&logoColor=white)

Strongly typed programming language that builds on JavaScript for safer and more maintainable code.

### ![pnpm](https://img.shields.io/badge/pnpm-v8.10.0-f69220?logo=pnpm&logoColor=white)

Fast, disk space–efficient package manager for JavaScript and TypeScript projects.

### ![Prettier](https://img.shields.io/badge/Prettier-v3.4.2-F7B93E?logo=prettier&logoColor=black)

Code formatter that enforces a consistent style across the codebase.

### ![ESLint](https://img.shields.io/badge/ESLint-v9.18.0-4B32C3?logo=eslint&logoColor=white)

Linting utility for identifying and fixing code quality issues.

### ![Jest](https://img.shields.io/badge/Jest-v29.7.0-C21325?logo=jest&logoColor=white)

JavaScript testing framework with built-in support for unit and integration tests.

### ![dotenv](https://img.shields.io/badge/dotenv-v16.4.5-ecd53f?logo=dotenv&logoColor=black)

Loads environment variables from a `.env` file into `process.env`.

### ![Joi](https://img.shields.io/badge/Joi-v17.13.3-6bc46d?logo=node.js&logoColor=white)

Schema description and validation library for JavaScript objects, used to validate environment variables and
configuration.

## ⚡ Quick Start <a name="quick-start"></a>

```bash
# 1. Clone the repository
git clone https://bitbucket.org/brainwinner/paprika.git
cd paprika

# 2. Install dependencies
pnpm install

# 3. Run the development server
pnpm start:dev
```

---

## Development Guide <a name="development-guide"></a>

[Development Guide](./documentation/guides/development-guide.md) – Project architecture and organization. Includes the
DDD (domain,
application, infrastructure, interface, shared) structure, code reorganization, health check endpoint, and initial
test setup.
---

# 🔧 Development <a name="development"></a>

This project uses Prettier for code formatting and ESLint for code quality checks. It is necessary to run these tools
before committing any code to ensure consistency and maintainability.

## Prettier <a name="prettier"></a>

To check the format of all project files, you can use:

```bash
pnpm format:check 
```

To automatically apply formatting to all files, run:

```bash
pnpm format
```

## ESLint <a name="eslint"></a>

To check code quality with ESLint, run:

```bash
pnpm lint
```

To automatically apply ESLint fixes, use:

```bash
pnpm lint:fix
```

**Note:** ESLint only fixes errors it can resolve automatically, so you should review the execution result to ensure
there are no remaining errors.

---

# 🧪 Testing <a name="testing"></a>

To run all tests, execute:

```bash
pnpm test
```

To run tests with code coverage, use:

```bash
pnpm test:cov
```

You can view the coverage report openning the following file in your browser: ```coverage/index.html```

### Coverage Thresholds <a name="coverage-thresholds"></a>

- **Statements:** ≥ 60%
- **Branches:** ≥ 60%
- **Functions:** ≥ 60%
- **Lines:** ≥ 60%

### Pre-commit  <a name="pre-commit"></a>

To configure pre-commit, you need to set it up so it runs before tests, linting, and Prettier formatting in the project.

**NOTE:**  This project uses Git pre-commit hooks to ensure code quality by automatically running tests, linters, and
Prettier before each commit.

```bash
# Grant execution permissions to the setup_hooks.sh file
chmod +x setup_hooks.sh

# Add changes
git add [folder/file]

# Commit the changes
git commit -m "your message"

# This command triggers the pre-commit hook,
# which will block the commit if the necessary requirements are not met
```
