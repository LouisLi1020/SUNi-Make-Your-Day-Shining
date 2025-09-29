# Git Conventions for Suni Platform

## 📋 Overview
This document outlines the Git workflow, commit message conventions, and branching strategy for the Suni platform development.

## 🌊 Branch Strategy

### Main Branches
- **`main`**: Production-ready code, always deployable
- **`develop`**: Integration branch for features, staging environment

### Supporting Branches
- **`feature/*`**: New features (e.g., `feature/user-authentication`)
- **`bugfix/*`**: Bug fixes (e.g., `bugfix/cart-validation`)
- **`hotfix/*`**: Critical production fixes (e.g., `hotfix/payment-error`)
- **`release/*`**: Release preparation (e.g., `release/v1.0.0`)

### Branch Naming Convention
```
type/description-in-kebab-case

Examples:
- feature/water-activity-booking
- bugfix/shopping-cart-persistence
- hotfix/payment-gateway-timeout
- release/v1.2.0
```

## 📝 Commit Message Convention

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
- **`feat`**: New feature
- **`fix`**: Bug fix
- **`docs`**: Documentation changes
- **`style`**: Code style changes (formatting, etc.)
- **`refactor`**: Code refactoring
- **`test`**: Adding or updating tests
- **`chore`**: Build process, dependencies, etc.
- **`perf`**: Performance improvements
- **`ci`**: CI/CD changes

### Scopes (Optional)
- **`auth`**: Authentication related
- **`cart`**: Shopping cart functionality
- **`booking`**: Water activity booking
- **`payment`**: Payment processing
- **`ui`**: User interface
- **`api`**: Backend API
- **`db`**: Database related
- **`config`**: Configuration files

### Examples
```bash
# Feature commits
feat(auth): add JWT authentication system
feat(booking): implement water activity scheduling
feat(ui): create responsive product catalog

# Bug fixes
fix(cart): resolve cart persistence issue
fix(payment): handle Stripe webhook validation
fix(api): correct user profile update endpoint

# Documentation
docs: update API documentation for booking endpoints
docs(readme): add deployment instructions

# Refactoring
refactor(ui): extract reusable product card component
refactor(api): optimize database queries for product search

# Chores
chore: update dependencies to latest versions
chore(config): add environment variables for production
```

## 🔄 Workflow

### 1. Feature Development
```bash
# Start from develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/user-authentication

# Make commits with conventional messages
git add .
git commit -m "feat(auth): add user registration form"
git commit -m "feat(auth): implement JWT token generation"
git commit -m "test(auth): add authentication unit tests"

# Push feature branch
git push origin feature/user-authentication

# Create Pull Request to develop
```

### 2. Bug Fixes
```bash
# Start from develop branch
git checkout develop
git pull origin develop

# Create bugfix branch
git checkout -b bugfix/cart-validation

# Make commits
git commit -m "fix(cart): validate product availability before adding"
git commit -m "test(cart): add cart validation tests"

# Push and create PR
git push origin bugfix/cart-validation
```

### 3. Hotfixes
```bash
# Start from main branch
git checkout main
git pull origin main

# Create hotfix branch
git checkout -b hotfix/payment-gateway-timeout

# Make critical fix
git commit -m "fix(payment): increase Stripe timeout to 30 seconds"

# Push and create PR to both main and develop
git push origin hotfix/payment-gateway-timeout
```

## 🏷️ Tagging Strategy

### Version Format
```
v<major>.<minor>.<patch>

Examples:
- v1.0.0 (Initial release)
- v1.1.0 (New features)
- v1.1.1 (Bug fixes)
- v2.0.0 (Breaking changes)
```

### Creating Tags
```bash
# Create and push tag
git tag -a v1.0.0 -m "Release version 1.0.0: Initial MVP with core e-commerce features"
git push origin v1.0.0

# Create tag for hotfix
git tag -a v1.0.1 -m "Hotfix: Fix critical payment processing issue"
git push origin v1.0.1
```

## 📋 Pull Request Guidelines

### PR Title Format
```
<type>: <description>

Examples:
- feat: Add water activity booking system
- fix: Resolve shopping cart persistence issue
- docs: Update API documentation
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots for UI changes]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

## 🚫 What NOT to Commit

### Files to Exclude
- `.env` files (use `.env.example` instead)
- `node_modules/` directories
- Build artifacts (`dist/`, `build/`)
- IDE-specific files (`.vscode/`, `.idea/`)
- OS-specific files (`.DS_Store`, `Thumbs.db`)
- Log files (`*.log`)
- Temporary files

### Sensitive Information
- API keys and secrets
- Database credentials
- Private keys
- Personal information
- Production configuration

## 🔧 Git Hooks (Optional)

### Pre-commit Hook
```bash
#!/bin/sh
# Run linting and tests before commit
npm run lint
npm run test
```

### Commit Message Hook
```bash
#!/bin/sh
# Validate commit message format
commit_regex='^(feat|fix|docs|style|refactor|test|chore|perf|ci)(\(.+\))?: .{1,50}'
if ! grep -qE "$commit_regex" "$1"; then
    echo "Invalid commit message format!"
    echo "Format: <type>(<scope>): <description>"
    exit 1
fi
```

## 📊 Commit Statistics

### Useful Commands
```bash
# View commit history
git log --oneline --graph --decorate

# View commits by author
git log --author="username" --oneline

# View commits by type
git log --grep="feat:" --oneline

# View file change statistics
git log --stat

# View commit frequency
git log --pretty=format:"%ad" --date=short | sort | uniq -c
```

## 🎯 Best Practices

### 1. Commit Frequency
- Commit early and often
- Each commit should represent a logical unit of work
- Avoid large commits with multiple unrelated changes

### 2. Commit Messages
- Use present tense ("add feature" not "added feature")
- Keep first line under 50 characters
- Be descriptive but concise
- Reference issues when applicable

### 3. Branch Management
- Keep branches short-lived
- Delete merged branches
- Regularly sync with main branches
- Use descriptive branch names

### 4. Code Review
- All changes require PR review
- At least one approval required
- Address review feedback promptly
- Test changes before requesting review

## 🔗 Related Documentation
- [Development Setup](DEVELOPMENT_SETUP.md)
- [Code Style Guide](CODE_STYLE.md)
- [Testing Guidelines](TESTING.md)
- [Deployment Process](DEPLOYMENT.md)

---

**Remember**: Good Git practices make collaboration easier and project history more meaningful! 🌊
