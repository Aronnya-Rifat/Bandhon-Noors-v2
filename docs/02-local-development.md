# Bandhon Noors v2 — Local Development Setup

**Document:** `docs/02-local-development.md`  
**Project:** Bandhon Noors v2  
**Status:** Initial Setup Guide  
**Visibility:** Private/local documentation only — never deploy this file publicly.

---

## 1. Purpose

This document explains how to prepare a development computer for Bandhon Noors v2.

It covers:

- required software,
- recommended versions and version strategy,
- repository location,
- Git setup,
- Python setup,
- Node.js setup,
- Docker,
- PostgreSQL development setup,
- environment files,
- editor configuration,
- local ports,
- useful command conventions,
- and verification steps.

The goal is to make the development environment repeatable and understandable before application code is created.

---

## 2. Development Environment Strategy

Bandhon Noors v2 will use a hybrid local-development approach.

### Applications run locally

During normal development:

- Next.js customer frontend runs locally,
- Next.js admin web runs locally,
- FastAPI backend runs locally,
- React Native / Expo runs locally.

### Infrastructure runs in containers where useful

Development infrastructure such as:

- PostgreSQL,
- Redis,
- and selected supporting services

will preferably run in Docker containers.

This provides a clean and reproducible environment without requiring every service to be manually installed and configured directly on the computer.

---

## 3. Supported Development Operating Systems

The project should remain workable on:

- Windows 11,
- macOS,
- Linux.

For Windows, development can be done either directly in Windows or with WSL2.

If Docker Desktop is used on Windows, WSL2 support is recommended.

The project must not depend on developer-specific absolute paths.

Bad:

```text
C:\Users\Aronnya\Desktop\bandhon-noors\...
```

Good:

```text
./backend
./frontend
./docs
```

---

## 4. Required Software

The development machine should have:

1. Git
2. Python
3. Node.js
4. npm
5. Docker
6. Docker Compose
7. A code editor
8. A modern browser

Later, mobile development may additionally require:

- Expo tooling,
- Android Studio for Android emulation,
- Xcode on macOS for iOS simulation.

---

## 5. Recommended Version Strategy

Avoid using random or very old software versions.

The project should prefer:

- an actively supported Python version,
- an active Node.js LTS version,
- a current Docker release,
- a supported PostgreSQL major version.

Exact versions should eventually be pinned in project configuration.

Examples of places where versions may be pinned later:

```text
.python-version
package.json
Dockerfile
docker-compose.yml
```

Do not upgrade major runtime versions in production without testing the change in local and staging environments first.

---

## 6. Recommended Project Location

Choose a simple path without unnecessary spaces or unusual characters.

Examples:

### Windows

```text
C:\Projects\bandhon-noors
```

### macOS/Linux

```text
~/Projects/bandhon-noors
```

Avoid developing directly inside temporary folders or Downloads.

---

## 7. Initial Repository Structure

The root will eventually look like:

```text
bandhon-noors/
|
├── backend/
├── frontend/
├── admin-web/
├── admin-mobile/
├── docs/
├── infrastructure/
├── scripts/
├── .gitignore
├── .env.example
├── README.md
└── docker-compose.yml
```

At the current stage, only documentation may exist.

Folders should be created only when they have a defined purpose.

---

## 8. Git

Git will track all project source code and documentation.

Git should track:

- source code,
- documentation,
- database migration files,
- configuration templates,
- infrastructure definitions,
- tests.

Git must not track:

- passwords,
- private keys,
- production credentials,
- local `.env` files,
- build output,
- temporary files,
- dependency folders,
- local database files,
- uploaded customer/product media.

---

## 9. Verify Git

Run:

```bash
git --version
```

Expected result:

```text
git version ...
```

The exact version may differ.

If the command is not recognized, Git must be installed before continuing.

---

## 10. Git Identity

Configure your Git identity if it is not already configured.

Example:

```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

Check it:

```bash
git config --global --list
```

Use an email address appropriate for the Git hosting account you will use.

---

## 11. Python

Python will power the FastAPI backend and backend-related scripts.

Verify:

```bash
python --version
```

On some systems:

```bash
python3 --version
```

The project will later pin a supported Python version.

---

## 12. Python Virtual Environment

The backend should use an isolated virtual environment.

Planned backend location:

```text
backend/
```

Typical creation:

### Windows PowerShell

```powershell
cd backend
python -m venv .venv
```

Activate:

```powershell
.\.venv\Scripts\Activate.ps1
```

### macOS/Linux

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

When activated, the terminal will typically show:

```text
(.venv)
```

The `.venv` folder must not be committed to Git.

---

## 13. Why Use a Python Virtual Environment?

Without a virtual environment:

```text
Computer-wide Python
├── Project A packages
├── Project B packages
└── Bandhon Noors packages
```

Dependencies can conflict.

With a virtual environment:

```text
Bandhon Noors
└── backend/.venv/
    └── only backend dependencies
```

This keeps backend packages isolated and reproducible.

---

## 14. Python Package Management

Initial package installation will likely use `pip`.

Later, dependencies may be captured in:

```text
requirements.txt
```

or another deliberate Python dependency-management format.

The exact dependency workflow will be chosen before backend packages are installed.

Do not install random packages globally for this project.

---

## 15. Node.js

Node.js will power:

- the customer Next.js application,
- the admin Next.js application,
- React Native / Expo tooling.

Verify:

```bash
node --version
```

Then:

```bash
npm --version
```

Both commands should return version numbers.

---

## 16. Node Package Management

The project should use one primary JavaScript package manager consistently.

Initial default:

```text
npm
```

Do not mix package managers casually.

For example, avoid creating:

```text
package-lock.json
yarn.lock
pnpm-lock.yaml
```

for the same application unless there is a deliberate migration.

---

## 17. Docker

Docker will be used to run local infrastructure consistently.

Verify:

```bash
docker --version
```

Then:

```bash
docker compose version
```

Both commands should work.

Docker Desktop users should ensure Docker is running before attempting container commands.

---

## 18. Why Docker for Infrastructure?

Without Docker, every developer may have a different local PostgreSQL setup.

With Docker:

```text
docker-compose.yml
        |
        v
Same PostgreSQL setup
Same Redis setup
Same local ports
Same service names
```

This improves reproducibility.

---

## 19. PostgreSQL Development Strategy

The preferred initial approach is:

```text
Developer computer
        |
        v
Docker
        |
        v
PostgreSQL container
```

FastAPI will connect to PostgreSQL over a local connection string.

Conceptually:

```text
postgresql://USERNAME:PASSWORD@localhost:5432/DATABASE_NAME
```

Real credentials must not be hard-coded into source files.

---

## 20. PostgreSQL Data Persistence

The PostgreSQL Docker container must use a persistent volume.

Without a persistent volume:

```text
Container deleted
-> database data may disappear
```

With a volume:

```text
Container deleted/recreated
-> database data remains
```

Exact volume configuration will be created when `docker-compose.yml` is built.

---

## 21. Redis

Redis is not required for the first backend file.

It may later be used for:

- caching,
- background jobs,
- queues,
- rate-limiting support,
- selected temporary state.

Do not add Redis just because it appears in the architecture.

We should introduce it only when a real feature requires it.

---

## 22. Code Editor

Recommended editor:

```text
Visual Studio Code
```

Other editors are acceptable if they support:

- Python,
- TypeScript,
- ESLint,
- formatting,
- Git,
- Docker,
- terminal integration.

The project should not depend on editor-specific features.

---

## 23. Useful VS Code Extensions

Useful examples include:

- Python
- Pylance
- ESLint
- Prettier
- Docker
- GitLens
- Tailwind CSS IntelliSense

These are convenience tools, not runtime dependencies.

---

## 24. Browser

A modern browser is needed for testing.

Recommended primary browsers:

- Chrome
- Edge
- Firefox
- Safari on macOS/iOS where relevant

Production UI should not be tested in only one browser.

---

## 25. Environment Variables

Environment variables store configuration that changes by environment.

Example:

```text
DATABASE_URL=...
APP_ENV=local
SECRET_KEY=...
```

Real environment files should remain private.

Planned pattern:

```text
.env
.env.local
.env.staging
.env.production
```

Exact names may vary by application.

---

## 26. `.env.example`

The repository should contain a safe template.

Example:

```text
DATABASE_URL=postgresql://username:password@localhost:5432/database
SECRET_KEY=replace-me
APP_ENV=local
```

The template shows which values are needed.

It must not contain real production secrets.

---

## 27. Local Environment Separation

Local development must never accidentally use the production database.

Bad:

```text
Local FastAPI
      |
      v
Production PostgreSQL
```

Preferred:

```text
Local FastAPI
      |
      v
Local PostgreSQL
```

Production access should require deliberate configuration.

---

## 28. Planned Local Ports

Initial suggested ports:

```text
Customer frontend: 3000
Admin web:         3001
FastAPI:           8000
PostgreSQL:        5432
Redis:             6379
```

These are development defaults.

They may be adjusted if conflicts exist.

---

## 29. Planned Local URLs

Examples:

```text
Customer:
http://localhost:3000

Admin:
http://localhost:3001

Backend:
http://localhost:8000

FastAPI docs during development:
http://localhost:8000/docs
```

The FastAPI documentation endpoint must not be assumed to remain public in production.

Production API documentation exposure will be a security/configuration decision.

---

## 30. HTTPS Locally

Normal local development may initially use:

```text
http://localhost
```

Production must use HTTPS.

Local HTTPS can be introduced later if a feature specifically requires it.

Do not confuse local HTTP development with production security requirements.

---

## 31. Production HTTPS Requirement

Production must use:

```text
https://
```

Even before SSLCOMMERZ is added.

HTTPS protects:

- login credentials,
- customer addresses,
- phone numbers,
- order details,
- admin sessions,
- payment references.

SSLCOMMERZ integration and SSL/TLS are separate concepts.

---

## 32. Private Documentation

The `docs/` folder is local/private project reference material.

It may be stored in the private source repository.

It must not be copied into:

```text
frontend/public/
```

or any equivalent public web directory.

Deployment workflows must deploy applications, not expose the docs folder.

---

## 33. File Naming

Use clear names.

Examples:

```text
product_service.py
product_repository.py
inventory.py
ProductCard.tsx
order-status.ts
```

Avoid unclear names such as:

```text
test2.py
newfile.js
final-final.tsx
stuff.py
```

---

## 34. Code Formatting

Formatting should be automated.

Python will later use appropriate formatting/linting tools.

TypeScript/React will later use tools such as:

- ESLint,
- Prettier.

Consistent formatting reduces unnecessary code-review noise.

---

## 35. Line Endings

The repository should use consistent line endings.

Cross-platform Git configuration should avoid repeatedly changing entire files because of line-ending differences.

A `.gitattributes` file may later be added.

---

## 36. Command Execution Rule

Always verify your current directory before running destructive or project-specific commands.

Examples:

### Windows PowerShell

```powershell
Get-Location
```

### macOS/Linux

```bash
pwd
```

Do not blindly run delete, migration, or reset commands without confirming the environment.

---

## 37. Database Command Safety

Commands that destroy or reset data should be clearly identified.

Local reset operations may be acceptable.

Production reset operations are not.

Example distinction:

```text
LOCAL:
reset test database

PRODUCTION:
never run without a deliberate backup/recovery plan
```

---

## 38. Development Database Naming

Use obvious names.

Example:

```text
bandhon_noors_dev
bandhon_noors_test
```

Future environments may use:

```text
bandhon_noors_staging
bandhon_noors_production
```

Database names should make accidental cross-environment mistakes less likely.

---

## 39. Test Database

Automated backend tests should use a separate test database or isolated test strategy.

Tests should not corrupt normal development data.

Conceptually:

```text
Development:
bandhon_noors_dev

Tests:
bandhon_noors_test
```

Exact test infrastructure will be defined later.

---

## 40. Git Branch Strategy

Initial development can remain simple.

Recommended starting point:

```text
main
```

For larger changes:

```text
feature/product-inventory
feature/admin-login
fix/order-stock
```

Do not create unnecessary branching complexity before multiple contributors require it.

---

## 41. Commit Strategy

Commits should represent understandable changes.

Good examples:

```text
Add backend project configuration
Add PostgreSQL development service
Implement category model
Add product code generator
```

Avoid vague commit messages:

```text
changes
stuff
fix
final
```

---

## 42. Secrets in Terminal History

Be careful when typing production secrets directly into shell commands.

Shell history may retain commands.

Prefer secure environment/configuration mechanisms rather than repeatedly typing secrets in command arguments.

---

## 43. Media During Development

Development should not initially depend on production product-media storage.

Options may include:

- local storage for early development,
- development object-storage bucket,
- local S3-compatible service.

The exact approach will be defined before the media module.

Production media and test media should remain separated.

---

## 44. Mobile Development

The mobile admin application will come later.

Likely development workflow:

```text
React Native + Expo
        |
        +--> Physical Android/iPhone via Expo
        |
        +--> Android emulator
        |
        +--> iOS simulator on macOS
```

The mobile app must point to the correct backend environment.

When testing on a physical phone, `localhost` refers to the phone itself, not the development computer.

We will document LAN/dev-server configuration when mobile development begins.

---

## 45. Firewall Considerations

Local development ports normally remain local.

If a physical mobile device needs to access FastAPI over the local network, the operating-system firewall may require a temporary development rule.

Do not expose local development services directly to the public internet.

---

## 46. Recommended Setup Order

Prepare the development computer in this order:

```text
1. Git
2. Code editor
3. Python
4. Node.js + npm
5. Docker
6. Docker Compose
7. Browser
8. Clone/create repository
9. Create local environment files
10. Start local infrastructure
11. Create backend virtual environment
12. Install backend dependencies
13. Install frontend dependencies
```

Steps 8–13 will be performed later as actual project files are created.

---

## 47. Verification Checklist

Before application development begins, verify:

### Git

```bash
git --version
```

### Python

```bash
python --version
```

or:

```bash
python3 --version
```

### Node.js

```bash
node --version
```

### npm

```bash
npm --version
```

### Docker

```bash
docker --version
```

### Docker Compose

```bash
docker compose version
```

All commands should execute successfully.

---

## 48. Windows Notes

If PowerShell blocks Python virtual-environment activation, Windows may report an execution-policy error.

Do not permanently weaken system security without understanding the change.

We will handle the exact fix only if it occurs.

For Docker Desktop, ensure:

- virtualization support is enabled,
- WSL2 is functioning if used,
- Docker Desktop is running.

---

## 49. macOS Notes

macOS may require developer command-line tools for Git and compilation tasks.

Homebrew can be useful for installing development software, but the project must not depend on Homebrew specifically.

For iOS mobile simulation, Xcode is required.

---

## 50. Linux Notes

Package names vary by distribution.

Linux developers may need:

- Python development headers,
- build tools,
- Docker group configuration.

Do not use `sudo pip install` for normal project dependencies.

Use the project virtual environment.

---

## 51. What We Are Not Installing Yet

Do not install the entire future stack immediately.

At this stage, there is no need to install:

- Celery,
- Redis Python clients,
- payment SDKs,
- cloud SDKs,
- image-processing libraries,
- React Native dependencies,
- analytics packages,
- notification providers.

Dependencies will be added only when the corresponding feature is being built.

This keeps the project understandable.

---

## 52. Local Development Philosophy

The development setup should satisfy four goals:

### Reproducible

A second development machine should be able to follow the same documented procedure.

### Isolated

Bandhon Noors dependencies should not interfere with unrelated projects.

### Safe

Local work should not accidentally modify production systems.

### Understandable

Every installed dependency and service should have a known purpose.

---

## 53. Planned First Executable Files

After the local development documentation is complete, the first real repository files should be created.

Recommended sequence:

```text
.gitignore
README.md
.env.example
docker-compose.yml
backend/
```

We will still create them one at a time.

For each executable/configuration file, the full file contents will be shown in the conversation so the code/configuration is visible while it is being built.

---

## 54. First Local Setup Session

When we begin executing setup steps, we should verify the user's actual machine rather than assume installed software.

The first commands should be:

```bash
git --version
python --version
node --version
npm --version
docker --version
docker compose version
```

The results determine which installation steps are needed.

---

## 55. Hosting Is Not Local Development

Local development and hosting are separate.

Local:

```text
localhost
development credentials
development database
```

Production:

```text
bandhonnoors.com
HTTPS
production credentials
production database
backups
monitoring
```

We will create a dedicated production-hosting guide later.

---

## 56. Documentation Security

This file and the rest of `docs/` are private technical material.

They may contain architectural details useful to the project team.

They must never contain:

- real passwords,
- real private keys,
- production secret tokens,
- customer credentials.

Even private documentation should not become a secret vault.

---

## 57. Next File

The next file should be the first real repository configuration file:

```text
.gitignore
```

This will be the first live project file whose full contents should be shown directly in the conversation.

Its purpose will be to prevent sensitive, generated, temporary, and machine-specific files from entering Git.

After `.gitignore`, likely next files are:

```text
README.md
.env.example
docker-compose.yml
```

Each will be created and explained separately.

---

## 58. Document Status

This document establishes the baseline local development approach for Bandhon Noors v2.

Exact installation commands for missing software should be selected based on the actual development operating system and current workstation state when setup begins.
