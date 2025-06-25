# Contributing to AgileGamifAI

Thank you for your interest in contributing to AgileGamifAI! This document provides guidelines and important security considerations for contributors.

## 🚨 Security Guidelines (CRITICAL)

**Before contributing, please understand that this application has a fundamental security limitation:**

### API Key Security
- **ALL environment variables prefixed with `VITE_` are exposed** in the client-side JavaScript bundle
- **Your API keys WILL BE VISIBLE** to anyone who uses the application
- **NEVER commit production API keys** to version control
- **NEVER use billing-enabled keys** for development or testing

### Safe Development Practices
1. **Use demo accounts**: Create separate API accounts specifically for development
2. **Set strict limits**: Configure low daily/monthly quotas on development API keys
3. **Use `.env.local`**: Store personal API keys in `.env.local` (git-ignored)
4. **Monitor usage**: Watch for unexpected API usage that might indicate key misuse
5. **Rotate regularly**: Change API keys frequently (weekly/monthly)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### Setup Process
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/AgileGamifAI.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env.local` and add your demo API keys
5. Start development server: `npm run dev`

### API Key Setup
1. **HuggingFace**: Create account at https://huggingface.co and generate token with minimal permissions
2. **Supabase**: Set up free project at https://supabase.com for testing
3. **Important**: Use separate "demo" accounts, not your main accounts

## Development Workflow

### Code Standards
- Follow existing TypeScript and React patterns
- Use Tailwind CSS for styling
- Maintain existing component structure
- Add TypeScript types for new features

### Testing
- Run tests: `npm test`
- Add tests for new functionality
- Ensure all tests pass before submitting PR

### Code Quality
- Run linter: `npm run lint`
- Fix any linting issues
- Run type check: `npm run type-check`
- Ensure no TypeScript errors

## Pull Request Process

### Security Review Checklist
Before submitting a PR, ensure:
- [ ] No actual API keys committed to repository
- [ ] New environment variables documented in `.env.example`
- [ ] Security implications of changes documented
- [ ] SECURITY.md updated if adding new API integrations
- [ ] Code works with demo/limited API keys

### PR Requirements
1. **Clear description**: Explain what changes and why
2. **Security impact**: Document any security considerations
3. **Testing**: Include test results and manual testing notes
4. **Documentation**: Update relevant documentation

### Review Process
1. **Automated checks**: CI/CD pipeline runs tests and linting
2. **Security review**: Maintainers check for security implications
3. **Code review**: Technical review of implementation
4. **Approval**: At least one maintainer approval required

## Security Incident Response

### If You Accidentally Commit API Keys
1. **Don't panic** - but act quickly
2. **Immediately rotate** the exposed API keys
3. **Notify maintainers** about the incident
4. **Remove from history** if possible (rewrite commits)
5. **Monitor usage** for unexpected activity

### Reporting Security Issues
- **Do not** open public issues for security vulnerabilities
- **Email maintainers** directly or use GitHub's private reporting
- **Include details** about the vulnerability and impact
- **Wait for response** before public disclosure

## Code of Conduct

### Security Expectations
- Understand and respect the security limitations of this architecture
- Never put production systems at risk
- Help educate other contributors about security best practices
- Report security concerns promptly and responsibly

### Collaboration Guidelines
- Be respectful and professional
- Provide constructive feedback
- Help newcomers understand security considerations
- Share knowledge about secure development practices

## Architecture Considerations

### Current Limitations
- Client-side only architecture
- API keys exposed in build artifacts
- Suitable for development/demo use only
- Not production-ready without backend security

### Future Direction
We are planning migration to a more secure architecture:
1. Backend API for LLM calls
2. Proper secret management
3. User authentication and authorization
4. Production-ready security measures

Contributors can help by:
- Designing backend API specifications
- Implementing serverless function prototypes
- Creating migration documentation
- Building secure authentication systems

## Questions and Support

- **General questions**: Open a GitHub issue
- **Security concerns**: Contact maintainers privately
- **Architecture discussions**: Use GitHub Discussions
- **Bug reports**: Use the issue template

## Recognition

Contributors who help improve security will be recognized in:
- README.md acknowledgments
- Release notes
- Security hall of fame (if we create one)

Thank you for helping make AgileGamifAI better and more secure! 🙏