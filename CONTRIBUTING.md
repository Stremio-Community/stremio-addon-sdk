# Contributing to Stremio Addon SDK

Thank you for your interest in contributing to the Community Stremio Addon SDK! We're excited to have you here. This guide will help you get started with contributing to the project.

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please:

- Be respectful and considerate
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Respect differing viewpoints and experiences
- Accept responsibility and apologize for mistakes

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** - LTS version or higher
- **PNPM** - v10 or higher (we use PNPM workspaces)
- **Git** - For version control

### Initial Setup

1. **Fork the repository**

   Click the "Fork" button at the top right of the repository page.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/stremio-addon-sdk.git
   cd stremio-addon-sdk
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/Stremio-Community/stremio-addon-sdk.git
   ```

4. **Install dependencies**

   ```bash
   pnpm install
   ```

5. **Build the project**

   ```bash
   pnpm build
   ```

## 🔄 Development Workflow

### Creating a Branch

Always create a new branch for your work:

```bash
# Update your main branch
git checkout main
git pull upstream main

# Create a feature branch
git checkout -b feature/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### Making Changes

1. Make your changes in the appropriate package(s)
2. Test your changes thoroughly
3. Ensure code formatting is correct: `pnpm format:fix`
4. Build the project: `pnpm build`

### Watch Mode for Development

For active development, use watch mode:

```bash
pnpm build:watch
```

This will automatically rebuild packages as you make changes.

## 💬 Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Commit Format

```
type(scope): subject

body (optional)

footer (optional)
```

The scope is optional.

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or updating tests
- **chore**: Build process or tooling changes

### Examples

```bash
feat(sdk): add support for subtitle handlers
fix(validation/zod): correct manifest schema validation
refactor(runtime/node-express): improve error handling
docs: update installation instructions
refactor: simplify handler registration
chore: update dependencies
```

### Commit Best Practices

- Write clear, concise commit messages
- Use present tense ("add feature" not "added feature")
- Keep the subject line under 72 characters
- Reference issues in the footer (e.g., "Fixes #123")

## 🔀 Pull Request Process

### Before Submitting

1. ✅ Ensure your code builds: `pnpm build`
2. ✅ Run tests (when available): `pnpm test`
3. ✅ Check formatting: `pnpm format`
4. ✅ Update documentation if needed
5. ✅ Commit your changes following commit guidelines

### Submitting a PR

1. **Push your branch**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Go to the repository on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

3. **PR Title Format**

   Use the same format as commit messages:

   ```
   feat(sdk): add subtitle support
   ```

4. **PR Description**

   Include:
   - Summary of changes
   - Motivation and context
   - Related issues (e.g., "Closes #123")
   - Breaking changes (if any)
   - Screenshots (if applicable)

### PR Review Process

- Maintainers will review your PR
- Address any requested changes
- Keep your PR up to date with main:
  ```bash
  git fetch upstream
  git rebase upstream/main
  git push -f origin your-branch
  ```

## 📚 Documentation

### When to Update Documentation

- Changing public APIs
- Adding new packages
- Adding examples

### Documentation Standards

- Use clear, concise language
- Include code examples
- Keep README.md up to date

## 🚢 Release Process

Releases are managed by maintainers. The process includes:

1. Version bump following [Semantic Versioning](https://semver.org/)
2. Update release notes
3. Create a release tag
4. Publish to npm registry

### Using Changesets

This project uses [Changesets](https://github.com/changesets/changesets) for version management and automated releases. When contributing:

1. Create a changeset: `pnpm changeset`
2. Fill out the prompted information about your changes and commit the changeset file.
3. The changeset will be included in the next release. You can check the status of your changesets with `pnpm changeset:status`.

### Semantic Versioning

- **Major** (1.0.0): Breaking changes
- **Minor** (0.1.0): New features (backward compatible)
- **Patch** (0.0.1): Bug fixes

## 🙋 Getting Help

- **Questions?** Open a [Discussion](https://github.com/Stremio-Community/stremio-addon-sdk/discussions)
- **Bug?** Open an [Issue](https://github.com/Stremio-Community/stremio-addon-sdk/issues) with the `bug` label
- **Feature request?** Open an [Issue](https://github.com/Stremio-Community/stremio-addon-sdk/issues) with the `feature` label

## 🎉 Recognition

Contributors will be:

- Listed in the repository contributors
- Mentioned in release notes (for significant contributions)
- Part of a growing community

Thank you for making the Stremio addon development experience better for everyone! 🚀
