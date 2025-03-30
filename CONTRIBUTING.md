# Contributing to vibe-class

First off, thank you for considering contributing to vibe-class! It's people like you that make vibe-class such a great tool.

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

### Development Environment

You can enable verbose logging during development to help debug issues:

```bash
# Enable verbose logging
VIBE_CLASS_VERBOSE=true npm run test

# Or when running examples
VIBE_CLASS_VERBOSE=true node examples/product-example.js
```

This will output additional information about method generation and execution.

### Pull Requests

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### JavaScript Styleguide

All JavaScript code is linted with ESLint and formatted with Prettier.

```bash
# Run linting
npm run lint

# Run formatting
npm run format
```

### Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `perf:` A code change that improves performance
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools and libraries

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.
