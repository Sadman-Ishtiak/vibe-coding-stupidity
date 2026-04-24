# archives

This folder holds compressed snapshots created from the repository as part of the cleanup/handover process.

Current snapshots
-----------------
- `archived-scripts-2026-01-24.tar.gz` — contains the `_archived_scripts/` directory (one-time migration and maintenance scripts).

Notes
-----
- The archive was created on 2026-01-24 and stored here for easy retrieval.
- This is a local archive stored in the repository tree. For long-term retention, move the archive to secure storage (S3, private artifact store) and record the location in `PROJECT_DOCUMENTATION.md`.
- We scanned the repository for in-repo references (package.json, CI files, Dockerfiles) and found none. External deployment crontabs/CI on your hosting provider were not inspected — verify those before deleting scripts from this repo.
