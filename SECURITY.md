# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting Security Vulnerabilities

If you discover a security vulnerability in AgileGamifAI, please report it responsibly:

### How to Report
- **Email**: Create an issue in this repository and tag it as `security` 
- **Private Disclosure**: For sensitive issues, contact the maintainers directly through GitHub
- **Include**: Clear description, steps to reproduce, and potential impact

### What to Expect
- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 5 business days  
- **Resolution Timeline**: Varies by severity, but we aim for prompt fixes
- **Credit**: Security researchers will be credited unless they prefer to remain anonymous

### Security Best Practices

**For Users:**
- Use the latest version of AgileGamifAI
- Keep your environment variables secure
- Report suspicious behavior immediately

**For Developers:**
- This is a client-side React application with exposed environment variables
- API keys in `VITE_*` variables are visible in the browser
- Use demo/limited API keys for public deployments

## Security Updates

Security updates will be released as patch versions and documented in the changelog.
