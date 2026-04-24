# _archived_scripts

Purpose
-------
This folder contains one-time migration, maintenance and test scripts that were used during development, audits, or data migrations. They are preserved for auditability and for occasional manual re-use by operators.

Safety & Usage
--------------
- Do NOT run these scripts in production without approval from the platform owner and a full backup. Many scripts perform irreversible changes.
- Review the top comments/header in each script; most include `--dry-run` or `--backup` options. Prefer dry-run first.
- Typical run pattern:
  1. Create a backup of the production database and related assets.
  2. Run locally against a copy or staging instance: `node scripts/<script>.js --dry-run`.
  3. Validate results, then run with `--execute` if available.

Where to find related docs
--------------------------
- See the project-level audit docs for context and migration notes: `audit files/` and `PROJECT_DOCUMENTATION.md`.
- The executive summary and migration README in this folder describe the higher-level rationale for each script.

Retention and next steps
------------------------
- Recommended: Keep these files as an archive in this repo (or move them to a dedicated `migrations/` repo) — do not delete without creating a compressed backup and tagging the deletion commit.
- If you want to remove them from the main repo, first:
  1. Create an archive: `tar -czf archived-scripts-<date>.tar.gz _archived_scripts`
  2. Push the archive to a secure storage location (S3, private artifact store) and record its location in `PROJECT_DOCUMENTATION.md`.
  3. Delete or move the directory and tag the commit: `git tag archived-scripts-<date>`.

Who to contact
--------------
If you are unsure about running a script, contact the engineering lead or the author listed in the top of each script file before proceeding.

Revision
--------
This README was added as part of the production cleanup and handover (see `PRODUCTION_CLEANUP_COMPLETE.md`).
