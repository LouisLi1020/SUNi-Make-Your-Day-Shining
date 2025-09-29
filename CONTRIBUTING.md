# Contributing to Suni Platform

## 🌊 Welcome Contributors!

Thank you for your interest in contributing to the Suni platform! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Documentation](#documentation)
- [Community](#community)

## 🤝 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inclusive environment for all contributors, regardless of:
- Age, body size, disability, ethnicity
- Gender identity and expression
- Level of experience, education, socio-economic status
- Nationality, personal appearance, race, religion
- Sexual identity and orientation

### Expected Behavior
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment, trolling, or inflammatory comments
- Personal attacks or political discussions
- Public or private harassment
- Publishing others' private information without permission
- Other unprofessional conduct

## 🚀 Getting Started

### Prerequisites
- Node.js v18.0.0 or higher
- MongoDB v6.0 or higher
- Git
- Basic knowledge of React, Node.js, and MongoDB

### Setup Development Environment
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/SUNi-Make-Your-Day-Shining.git`
3. Install dependencies: `npm run install:all`
4. Set up environment variables (see [Development Setup](docs/DEVELOPMENT_SETUP.md))
5. Start development servers: `npm run dev`

### First Contribution
Looking for your first contribution? Check out our [Good First Issues](https://github.com/LouisLi1020/SUNi-Make-Your-Day-Shining/labels/good%20first%20issue) label!

## 🔄 Development Process

### Branch Strategy
- **`main`**: Production-ready code
- **`develop`**: Integration branch for features
- **`feature/*`**: New features
- **`bugfix/*`**: Bug fixes
- **`hotfix/*`**: Critical production fixes

### Workflow
1. Create a new branch from `develop`
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request

### Commit Messages
Follow our [Git Conventions](docs/GIT_CONVENTIONS.md):
```
<type>(<scope>): <description>

Examples:
feat(auth): add JWT authentication system
fix(cart): resolve cart persistence issue
docs: update API documentation
```

## 📝 Pull Request Process

### Before Submitting
- [ ] Code follows our [Code Style Guide](docs/CODE_STYLE.md)
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Documentation is updated
- [ ] Commit messages follow conventions
- [ ] Branch is up to date with `develop`

### PR Template
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

### Review Process
1. Automated checks must pass
2. At least one maintainer review required
3. Address all feedback
4. Maintainer will merge when ready

## 🐛 Issue Guidelines

### Bug Reports
Use the bug report template and include:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

### Feature Requests
Use the feature request template and include:
- Clear description of the feature
- Use case and motivation
- Proposed solution
- Alternatives considered
- Additional context

### Issue Labels
- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested

## 📚 Documentation

### Types of Documentation
- **Code Comments**: Explain complex logic
- **API Documentation**: Document endpoints and schemas
- **User Guides**: Help users understand features
- **Developer Guides**: Help contributors understand the codebase

### Documentation Standards
- Use clear, concise language
- Include code examples
- Keep documentation up to date
- Follow our [Code Style Guide](docs/CODE_STYLE.md)

## 🧪 Testing

### Test Types
- **Unit Tests**: Test individual functions/components
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test complete user workflows

### Writing Tests
```typescript
// Good test example
describe('UserService', () => {
  it('should create user with valid data', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123'
    };

    const user = await UserService.createUser(userData);

    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.password).not.toBe(userData.password);
  });
});
```

### Test Coverage
- Aim for 80%+ code coverage
- Focus on critical business logic
- Test error cases and edge cases

## 🎨 Design Guidelines

### UI/UX Principles
- **Mobile-first**: Design for mobile devices first
- **Accessibility**: Follow WCAG guidelines
- **Consistency**: Use design system components
- **Performance**: Optimize for speed and efficiency

### Design System
- Use Tailwind CSS for styling
- Follow our color palette (beach/ocean theme)
- Use consistent spacing and typography
- Implement responsive design patterns

## 🔒 Security

### Security Guidelines
- Never commit sensitive information
- Use environment variables for secrets
- Validate all user inputs
- Implement proper authentication/authorization
- Follow OWASP security guidelines

### Reporting Security Issues
For security vulnerabilities, please email security@suni.com instead of creating a public issue.

## 🌍 Internationalization

### Multi-language Support
- Use i18n for all user-facing text
- Support RTL languages when needed
- Test with different languages
- Consider cultural differences

### Translation Process
1. Identify translatable strings
2. Add to translation files
3. Test with different languages
4. Update documentation

## 📊 Performance

### Performance Guidelines
- Optimize images and assets
- Use lazy loading where appropriate
- Implement caching strategies
- Monitor Core Web Vitals
- Minimize bundle sizes

### Performance Testing
- Test on different devices and networks
- Use performance monitoring tools
- Optimize database queries
- Implement proper error handling

## 🏷️ Release Process

### Version Numbering
We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## 💬 Community

### Communication Channels
- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Discord**: Real-time chat and collaboration

### Getting Help
- Check existing issues and discussions
- Read the documentation
- Ask questions in discussions
- Join our Discord community

### Recognition
Contributors will be recognized in:
- README.md contributors section
- Release notes
- Community highlights

## 📄 License

By contributing to Suni, you agree that your contributions will be licensed under the MIT License.

## 🙏 Thank You

Thank you for contributing to the Suni platform! Your contributions help make beach lifestyle and water activities more accessible to everyone.

---

**Questions?** Feel free to open an issue or start a discussion. We're here to help! 🌊
