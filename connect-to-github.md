# Connect to GitHub Repository

## After creating your GitHub repository, run these commands:

### 1. Add the remote origin (replace with your actual GitHub URL)
```bash
git remote add origin https://github.com/yourusername/abdulrahman-hussein-portfolio.git
```

### 2. Rename the default branch to main (GitHub's default)
```bash
git branch -M main
```

### 3. Push your code to GitHub
```bash
git push -u origin main
```

## Alternative: If you want to use SSH instead of HTTPS
```bash
git remote add origin git@github.com:yourusername/abdulrahman-hussein-portfolio.git
git branch -M main
git push -u origin main
```

## Verify the connection
```bash
git remote -v
```

## Future commits
After the initial setup, you can commit and push changes with:
```bash
git add .
git commit -m "Your commit message"
git push
```

---

## Repository Suggestions:

**Repository Name**: `abdulrahman-hussein-portfolio`
**Description**: `🌍 AI & Climate Change Innovator - Interactive Portfolio Website featuring 3D Earth visualization, climate-focused design, and scrollytelling showcase`
**Topics/Tags**: `portfolio`, `climate-change`, `ai`, `three-js`, `gsap`, `interactive`, `web-development`, `sustainability`
