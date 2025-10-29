# Stremio Addon SDK

A modern SDK for building [Stremio](https://www.stremio.com/) addons with TypeScript (or JavaScript).

## ✨ Features

- 🎯 **Type-safe** - Full TypeScript support with comprehensive type definitions
- ✅ **Runtime validation** - Optional schema validation using Zod (or bring your own validation library)
- 🚀 **Modern** - ESM-first, tree-shakeable
- 🧩 **Modular** - Composable packages for different use cases
- 📦 **Multiple runtimes** - Supports Node.js, Node.js + Express, hono, vercel, cloudflare workers etc. (or bring your own runtime)
- 🔧 **Easy migration** - The API is similar to the official SDK making it easy to switch

## 🚀 Quick Start

> [!NOTE]  
> The instructions below assume you are using `pnpm` as your package manager, but `npm` or `yarn` are supported too. Simply replace `pnpm add` with `npm install` or `yarn add` as needed.

Get started quickly by installing the core SDK, zod for validation and express as your runtime:

```bash
pnpm add @stremio-addon/sdk @stremio-addon/validation-zod @stremio-addon/runtime-node-express express
pnpm add -D typescript @types/express
```

Then see [examples/hello-world](./examples/hello-world/) for a simple code example.

## 📦 Installation

## 1. Install the SDK package

```bash
pnpm add @stremio-addon/sdk
```

## 2. Install a validation package (optional)

This step is optional but highly recommended to ensure your addon adheres to the expected schemas.

### zod

```bash
pnpm add @stremio-addon/validation-zod
```

## 3. Integrate with your preferred runtime (server, serverless, or custom)

See [supported runtimes](./docs/runtimes.md).

## 📖 Usage

See [examples](./examples/). If you know how to code an addon using the official SDK, you pretty much already know how to use this SDK. You can easily adapt to this SDK by following the [migration guide](./MIGRATION.md).

## 🆚 Comparison with Official SDK

| Feature                  | Community SDK                                         | Official SDK                  |
| ------------------------ | ----------------------------------------------------- | ----------------------------- |
| **TypeScript Support**   | ✅ Full native support                                | ⚠️ Type definitions available |
| **Runtime Validation**   | ✅ Zod schemas                                        | ❌ Manual validation          |
| **Type Safety**          | ✅ End-to-end type safety                             | ⚠️ Partial                    |
| **Modern Syntax**        | ✅ ESM, latest TypeScript                             | ⚠️ CommonJS                   |
| **Modular Architecture** | ✅ Composable packages                                | ❌ Monolithic                 |
| **Framework Support**    | 🔄 Extensible (server, serverless, or bring your own) | ⚠️ Express built-in           |
| **Bundle Size**          | ✨ Smaller with tree-shaking                          | ⚠️ Larger                     |
| **Active Development**   | ✅ Community-driven                                   | ✅ Official support           |

**When to use the Community SDK:**

- You're building with TypeScript
- You want strong type safety and IDE support
- You prefer modern JavaScript/TypeScript patterns
- You need runtime validation

**When to use the Official SDK:**

- You need proven stability with official support
- You're working with JavaScript
- You want the most battle-tested solution

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
