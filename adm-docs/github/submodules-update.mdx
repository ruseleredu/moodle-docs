## The Workflow File

```yml
name: CI - Update Submodules

on:
  workflow_dispatch:

permissions:
  contents: write # allows pushing commits/tags/branches

jobs:
  update-submodules:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 0

      - name: Update submodules to remote
        run: git submodule update --init --remote

      - name: Commit submodule updates
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "Update submodules to latest remote" || echo "No changes to commit"
          git push
```

## With key

Create new workflow file: (.github/workflows/update-submodules.yml)

```yml
name: Update Submodules

on:
  workflow_dispatch: # Allows manual triggering
  schedule:
    - cron: "0 2 * * *" # Runs every day at 2:00 AM UTC (Optional)

permissions:
  contents: write # allows pushing commits/tags/branches

jobs:
  update-submodules:
    runs-on: ubuntu-latest

    steps:
      - name: 1. Checkout Repository
        # This action fetches the code into the workspace root (no extra folder needed).
        uses: actions/checkout@v4

      - name: 2. Configure SSH and Git (For PUSHING changes back)
        run: |
          # A. Identity Setup
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git config --global user.name "github-actions[bot]"

          # B. Key Creation (Same manual setup to enable git push)
          mkdir -p ~/.ssh
          echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_ed25519
          chmod 600 ~/.ssh/id_ed25519
          ssh-keyscan github.com >> ~/.ssh/known_hosts

      - name: 3. Execute Update and Push Script
        # The commands now run from the root of the checked-out repository.
        run: |
          echo "Initialize submodules..."
          # This must be run first on a fresh checkout
          git submodule update --init

          echo "Get version file.."
          # Create or update the version file in the root
          wget https://raw.githubusercontent.com/moodle/moodle/MOODLE_500_STABLE/version.php -O version.php

          echo "Run: git submodule update --remote"
          git submodule update --remote

          # Check for changes
          if [[ -n $(git status -s) ]]; then
            echo "Changes detected. Committing..."
            git add .
            git commit -m "GitHub Actions submodule update."
            # The SSH key allows this push
            git push origin HEAD
          else
            echo "No changes detected. Skipping commit."
          fi
```

## Required Setup Steps

To make this work, you cannot simply commit the file. You must configure the security credentials so GitHub Actions has permission to clone via SSH and push changes.

### Generate a Deploy Key

Run this in your local terminal (do not add a passphrase):

```bash
ssh-keygen -t ed25519 -C "github-actions" -f gh_deploy_key
```

### Add the Public Key to the Repo

```bash
cat gh_deploy_key.pub
```

- Copy the content of gh_deploy_key.pub.
- Go to the moodle500-plugins repository on GitHub.
- Navigate to Settings > Deploy keys.
- Click Add deploy key.
- Title: `GitHub Actions CI`.
- Important: Check the box Allow write access (otherwise the git push will fail).
- Paste the key and save.

### Add the Private Key to Secrets

```bash
cat gh_deploy_key
```

- Copy the content of the private key file gh_deploy_key.
- Go to the repository where this Action will run.
- Navigate to Settings > Secrets and variables > Actions.
- Click New repository secret.
- Name: `SSH_PRIVATE_KEY`
- Paste the private key content and save.

### Markdown code for the status badge.

Copy and paste this line at the very top of your README.md file:

```md
[![Update Submodules](https://github.com/AdrianoRuseler/moodle500-plugins/actions/workflows/update-submodules.yml/badge.svg)](https://github.com/AdrianoRuseler/moodle500-plugins/actions/workflows/update-submodules.yml)
```

## Here is the step-by-step explanation of exactly what is happening in your workflow.

### The Triggers (on)

```yml
on:
  workflow_dispatch: # 1. Manual Trigger
  schedule:
    - cron: "0 2 * * *" # 2. Automatic Schedule
```

- `workflow_dispatch`: Adds a "Run workflow" button in the GitHub Actions UI so you can test it anytime without waiting.
- `schedule`: Uses cron syntax to run the job automatically every day at 2:00 AM UTC.

### The Setup Phase ("Configure SSH and Git")

This step prepares the fresh, empty Linux runner (server) to act like your local computer.

```bash
# A. Identity Setup
git config --global user.email "github-actions[bot]..."
git config --global user.name "github-actions[bot]"
```

- **Why**: Git refuses to create a commit unless it knows who is committing. We use the standard GitHub bot identity here so the commits look "official."

```bash
# B. Key Creation
mkdir -p ~/.ssh
echo "${{ secrets.SSH_PRIVATE_KEY }}" > ~/.ssh/id_ed25519
chmod 600 ~/.ssh/id_ed25519
```

- **The Magic**: We take the text stored in your GitHub Repository Secrets and write it to a physical file on the server (id_ed25519).
- `chmod 600`: This is critical. SSH requires private keys to be read-only by the owner. If permissions are too open (like 777), SSH will refuse to use the key for security reasons.

```bash
# C. Trusting GitHub
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

- **Why**: When you SSH into a server for the first time, it usually asks: "The authenticity of host github.com can't be established. Are you sure?"

### The Execution Phase

```bash
# B. Update Logic
git submodule update --init
wget ... -O version.php
git submodule update --remote
```

- `update --init`: If you added new submodules since the last run, this registers them locally.
- `wget`: Overwrites version.php with the latest raw file from Moodle HQ.
- `update --remote`: This is the heavy lifter. It goes into every submodule folder and pulls the latest commit from that submodule's remote branch (usually master or main).

### The Conditional Push (Safety Mechanism)

```bash
if [[ -n $(git status -s) ]]; then
  echo "Changes detected. Committing..."
  git add .
  git commit -m "GitHub Actions submodule update."
  git push origin HEAD
else
  echo "No changes detected..."
fi
```

- `git status -s`: This prints a short summary of changes.
- The Logic:

  - If the output is not empty (-n), it means submodules were updated or version.php changed. We commit and push.
  - If the output is empty, we do nothing.

- **Why**: If we ran git commit when there were no changes, the Action would crash with an error ("nothing to commit"). This if block ensures the job always ends green (success).
