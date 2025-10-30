# Stremio Addon SDK

A modern SDK for building [Stremio](https://www.stremio.com/) addons with TypeScript (or JavaScript).

## ✨ Features

- 🎯 **Type-safe** - Full TypeScript support with comprehensive type definitions
- ✅ **Runtime validation** - Optional schema validation using Zod (or bring your own validation library)
- 🚀 **Modern** - ESM-first, tree-shakeable
- 🧩 **Modular** - Composable packages for different use cases
- 📦 **Multiple runtimes** - Supports Node.js, Node.js + Express, hono, vercel, cloudflare workers etc. (or bring your own runtime)
- 🔧 **Easy migration** - The API is similar to the official SDK making it easy to switch

## 📦 Installation

> [!NOTE]  
> This project is in active development. Version `0.x.y` is usable but may introduce breaking changes between minor releases. The upcoming version `1.x.y` will mark the first stable release with semantic versioning guarantees.

## 1. Install the SDK package

```bash
pnpm add @stremio-addon/sdk
```

## 2. Install a validation package (optional)

This step is optional but highly recommended to ensure your addon adheres to the expected schemas.

### [zod](https://github.com/colinhacks/zod)

```bash
pnpm add @stremio-addon/zod zod
```

### [stremio-addon-linter](https://github.com/Stremio/stremio-addon-linter)

```bash
pnpm add @stremio-addon/linter stremio-addon-linter
```

## 3. Integrate with your preferred runtime (server, serverless, or custom)

See [supported runtimes](./docs/runtimes.md).

## 📖 Usage

See [examples](./examples/).

If you're totally new to addon development, check out the [official Stremio Addon SDK documentation](https://github.com/Stremio/stremio-addon-sdk/tree/master/docs) and the [Stremio addon protocol documentation](https://github.com/Stremio/stremio-addon-sdk/blob/master/docs/protocol.md) to get familiar with Stremio addon development concepts.

If you know how to code an addon using the official SDK already, you pretty much already know how to use this SDK. You can migrate your existing code in ~ 2 minutes by following the [migration guide](./MIGRATION.md).

## 🛠️ Development

### Prerequisites

- Node.js LTS or higher
- PNPM v10+

### Setup

```bash
# Clone the repository
git clone https://github.com/Stremio-Community/stremio-addon-sdk
cd stremio-addon-sdk

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Watch mode for development
pnpm build:watch
```

## 🤝 Contributing

We welcome contributions from the community! Please see our [Contribution Guide](CONTRIBUTING.md) for more details.

License: [MIT](./LICENSE)

## 🔗 Links

- [Stremio](https://www.stremio.com/)
- [Official Stremio Addon SDK](https://github.com/Stremio/stremio-addon-sdk)

## ⭐ Support

If you find this SDK useful, please consider giving it a star on GitHub!

---

Made with ❤️ by and for the Stremio community
