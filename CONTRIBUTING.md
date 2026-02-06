# Contributing to BakeBot

Thank you for your interest in contributing to BakeBot! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style and Standards](#code-style-and-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project follows a code of conduct to ensure a welcoming environment for all contributors. Please be respectful and considerate in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/bake-me-a-cake-bot-.git
   cd bake-me-a-cake-bot-
   ```
3. **Set up the development environment** following [SETUP.md](./SETUP.md)
4. **Create a feature branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

1. **Choose an issue** from the GitHub issues or create a new one
2. **Discuss the approach** if needed in the issue comments
3. **Implement your changes** following the code standards
4. **Write tests** for new functionality
5. **Test your changes** locally
6. **Commit your changes** with clear, descriptive messages
7. **Push to your fork** and create a pull request

## Code Style and Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow the existing code style (consistent indentation, naming conventions)
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused on a single responsibility

### React/Next.js

- Use functional components with hooks
- Follow the component structure in the existing codebase
- Use TypeScript interfaces for props
- Implement proper error boundaries

### Backend/Node.js

- Use async/await for asynchronous operations
- Validate input data
- Handle errors gracefully
- Use environment variables for configuration

### Database

- Follow existing migration patterns
- Use descriptive names for tables and columns
- Add appropriate indexes for performance

## Testing

- Write unit tests for all new functions and components
- Aim for good test coverage (>80%)
- Test both happy path and error scenarios
- Use descriptive test names

Run tests with:
```bash
# Frontend
cd frontend && npm run test

# Backend
cd backend && npm run test

# All tests
npm run test:all
```

## Submitting Changes

1. **Ensure your code passes all tests**
2. **Update documentation** if needed
3. **Write a clear commit message**:
   ```
   feat: add user authentication
   fix: resolve payment processing bug
   docs: update API documentation
   ```
4. **Create a pull request** with:
   - Clear title and description
   - Reference to the issue it addresses
   - Screenshots for UI changes
   - Test results

## Reporting Issues

When reporting bugs or requesting features:

- **Use the GitHub issue tracker**
- **Provide detailed information**:
  - Steps to reproduce
  - Expected vs actual behavior
  - Environment details (OS, browser, Node version)
  - Screenshots or error messages
- **Search existing issues** first to avoid duplicates

## Areas for Contribution

- **Frontend Development**: React components, UI/UX improvements
- **Backend Development**: API endpoints, database operations
- **AI Integration**: Image generation, customization features
- **Testing**: Unit tests, integration tests, E2E tests
- **Documentation**: Setup guides, API docs, user guides
- **DevOps**: CI/CD, deployment automation

## Questions?

If you have questions about contributing, feel free to:
- Comment on the relevant GitHub issue
- Join our Discord community (link TBD)
- Email the maintainers

Thank you for contributing to BakeBot! 🎂
