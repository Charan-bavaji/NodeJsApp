# nodejs-ci-assignment

Minimal Node.js app used to complete three Jenkins assignments:

1. **Basic Declarative Pipeline** (`Jenkinsfile`) — Checkout, Install, Test, Build, Archive Artifacts.
2. **GitHub Webhook CI** (`Jenkinsfile.webhook`) — same pipeline, triggered automatically on push via a GitHub webhook (through an ngrok tunnel).
3. **Docker Permission RCA** (`Jenkinsfile.docker`) — a Docker build stage used to reproduce and fix the `permission denied ... docker.sock` error.

## App

- `index.js` — a tiny app with an `add()` and `greet()` function.
- `test/app.test.js` — Mocha + Chai unit tests.
- `Dockerfile` — used only by assignment #3 to give the Docker Build stage something to build.

Run locally:
```bash
npm install
npm test
npm run build
```

## Setting up the three Jenkins jobs

All three jobs point at this same repo, just with a different **Script Path** (Jenkins lets you name the Jenkinsfile per job under Pipeline → "Script Path").

### Job 1 — `nodejs-ci-basic` (Assignment #1)
- New Item → Pipeline
- Pipeline script from SCM → Git → this repo URL → your GitHub PAT credential
- Script Path: `Jenkinsfile`
- Build Now → verify Checkout/Install/Test/Build/Archive all pass
- Install Blue Ocean plugin (Manage Jenkins → Plugins) and screenshot the run there

### Job 2 — `nodejs-ci-webhook` (Assignment #2)
- Same as Job 1, but Script Path: `Jenkinsfile.webhook`
- Under Build Triggers, check **"GitHub hook trigger for GITScm polling"**
- On the EC2 (or wherever ngrok runs): `ngrok http 8080`, copy the HTTPS URL
- GitHub repo → Settings → Webhooks → Add webhook
  - Payload URL: `<ngrok-url>/github-webhook/` (trailing slash required)
  - Content type: `application/json`
  - Just the push event
- Push a small change → confirm the job auto-triggers, and GitHub shows a `200 OK` delivery

### Job 3 — `nodejs-ci-docker-rca` (Assignment #3)
- Same as Job 1, but Script Path: `Jenkinsfile.docker`
- First run: expect it to **fail** at the `Docker Build` stage with the `permission denied` error — screenshot that failure log
- SSH into the Jenkins host/container, inspect docker.sock ownership and group membership, apply the fix (see RCA section below)
- Re-run: expect the stage to pass — screenshot the green build

## Root Cause Analysis — Assignment #3

> Fill in after reproducing the error on your setup.

**The Error:**
```
<paste the exact "permission denied ... docker.sock" log snippet here>
```

**The Root Cause:**
Since Jenkins is running as a **Docker container** on this EC2 (not a native systemd service), the standard "add the `jenkins` Linux user to the `docker` group" explanation doesn't directly apply. Instead check:
- Whether `/var/run/docker.sock` was bind-mounted into the Jenkins container at all
- Whether the container's internal user belongs to a group matching the **host's** docker socket GID (group *names* don't carry across the container boundary — only the numeric GID does)

Document which of these was actually true in your environment.

**The Fix:**
```
<paste the exact command(s) you ran — e.g. re-running the Jenkins container with
-v /var/run/docker.sock:/var/run/docker.sock and/or adjusting the in-container
user's group membership to match the host docker GID>
```

## Screenshots

- [ ] Blue Ocean pipeline view (Assignment #1)
- [ ] GitHub webhook delivery — 200 OK (Assignment #2)
- [ ] Jenkins console output — "Started by GitHub push by \<username\>" (Assignment #2)
- [ ] Docker permission error log (Assignment #3, before fix)
- [ ] Green Docker build (Assignment #3, after fix)
