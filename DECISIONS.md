# Decisions Log

A running record of technical decisions made on OrderFlow, why they were made, what alternatives were considerd, and what trade offs were accepted.

## [15/07/2026] .gitignore - excluding node_modules and .env

**Context:** The backend needed a way to exclude two kinds of files from git:
generated dependency code, and files containing secrets.

**Decision:** Added a .gitignore excluding node_modules/ and .env.

node_modules/ is excluded because it's a derived artifact, not source it's fully regenerable from package.json via `npm install`, so committing it means storing a copy of something that shouldn't need to be stored.

.env is excluded because it will hold real secrets (database connection
  string) once created. Committing it would leak credentials into git
  history permanently, visible to anyone with repo access.

**Alternatives considered:** Committing everything as is. Rejected bloats the repo with regenerable files, and risks leaking secrets if .env
is ever added to it.

**Trade offs accepted:** Anyone cloning the repo can't run it immediately they need to run `npm install` themselves and create their own .env file.
This is why .env.example exists: to document which variables are needed
without exposing real values.