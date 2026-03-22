# 📘 Git & GitHub Commands Cheat Sheet

> 🚀 Personal Notes for Quick Revision

---

## 🟢 INITIAL SETUP

```bash
# Set username
git config --global user.name "Your Name"

# Set email
git config --global user.email "your@email.com"

# Check config
git config --list
```

---

## 🔵 CREATE & CLONE REPOSITORY

```bash
# Initialize git
git init

# Clone repository
git clone https://github.com/username/repo.git
```

---

## 🟣 ADD & COMMIT

```bash
# Check status
git status

# Add all files
git add .

# Add specific file
git add filename.txt

# Commit changes
git commit -m "Your message"
```

---

## 🟡 PUSH & PULL

```bash
# Add remote
git remote add origin https://github.com/username/repo.git

# Push code
git push -u origin main

# Pull latest changes
git pull origin main
```

---

## 🔴 BRANCHING (VERY IMPORTANT 🔥)

```bash
# Create branch
git branch feature-branch

# Switch branch
git checkout feature-branch

# Create + switch
git checkout -b new-branch

# List branches
git branch

# Delete branch
git branch -d branch-name
```

---

## 🟠 MERGING

```bash
# Switch to main
git checkout main

# Merge branch
git merge feature-branch
```

---

## 🔹 VIEW HISTORY

```bash
# Show commits
git log

# One line log
git log --oneline

# Show changes
git diff
```

---

## 🔥 STASH (SAVE WORK TEMPORARILY)

```bash
# Save work
git stash

# Apply stash
git stash apply

# List stashes
git stash list

# Drop stash
git stash drop
```

---

## ⚡ UNDO CHANGES

```bash
# Unstage file
git reset filename.txt

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (delete changes)
git reset --hard HEAD~1
```

---

## 👁️ REMOTE REPO COMMANDS

```bash
# Show remote
git remote -v

# Change remote URL
git remote set-url origin new_url

# Remove remote
git remote remove origin
```

---

## 🔐 FORCE PUSH (USE CAREFULLY ⚠️)

```bash
git push --force
```

---

## 🧰 USEFUL COMMANDS

```bash
# Check current branch
git branch --show-current

# Rename branch
git branch -M main

# Fetch updates
git fetch

# Show file history
git log filename.txt
```

---

# 🚀 FINAL TIP

> 💡 Use `git status` frequently to avoid mistakes
> 💡 Commit small changes with clear messages
> 💡 Practice branching — very important for projects
