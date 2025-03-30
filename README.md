<div align="center">
  <img src="https://github.com/user-attachments/assets/65b8011c-6514-44e4-bb48-317d6e227f54" alt="vibe-class logo" width="100px" />
  
  <p align="center">
    <strong>{vibe-class}: AI-powered method generation for JavaScript classes</strong>
  </p>
  
  <p align="center">
    <a href="https://www.npmjs.com/package/vibe-class"><img src="https://img.shields.io/npm/v/vibe-class.svg" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/vibe-class"><img src="https://img.shields.io/npm/dm/vibe-class.svg" alt="npm downloads"></a>
    <a href="https://github.com/ramadis/vibe-class/actions"><img src="https://github.com/ramadis/vibe-class/workflows/CI/badge.svg" alt="CI status"></a>
    <a href="https://github.com/ramadis/vibe-class/blob/main/LICENSE"><img src="https://img.shields.io/github/license/ramadis/vibe-class.svg" alt="license"></a>
  </p>
  
  <p align="center">
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a> •
    <a href="#how-it-works">How It Works</a> •
    <a href="#api">API</a> •
    <a href="#license">License</a>
  </p>
</div>

## ✨ Overview

A vibe-coded utility library that uses AI to dynamically generate JavaScript class methods at runtime. No more boilerplate - just call the method you need, and vibe-class will generate it for you!

## 📦 Installation

```bash
npm install vibe-class
# or
yarn add vibe-class
```

## 🚀 Usage

### Basic Usage

```js
import asVibeClass from 'vibe-class';

// Initialize with your OpenAI API key
asVibeClass.initialize({
  apiKey: 'your-openai-api-key',
  service: 'openai',
});

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  getFullName() {
    return this.name;
  }
}

// Enhance the User class with AI-generated methods
const EnhancedUser = asVibeClass(User);

const user = new EnhancedUser('John Doe', 'john@example.com');

// Existing methods work as expected
console.log(user.getFullName()); // "John Doe"

// Methods that don't exist are dynamically generated
const domain = await user.getEmailDomain();
console.log(domain); // example.com
```

### Configuration

vibe-class requires an OpenAI API key to generate methods. Initialize it at the start of your application:

```js
import asVibeClass from 'vibe-class';

// Initialize the library
asVibeClass.initialize({
  apiKey: 'your-openai-api-key',
  service: 'openai', // Currently the only supported service
});

// Then use anywhere in your app
const EnhancedUser = asVibeClass(User);
```

## 🔍 How It Works

When you call a method that doesn't exist on your class, vibe-class:

1. Intercepts the method call
2. Uses OpenAI to generate the method implementation based on the method name and arguments
3. Caches the method for future calls (even across instances!)
4. Executes the method with your provided arguments

## 📚 API

### asVibeClass(originalClass)

Transforms a regular class into a class with dynamic method generation.

### asVibeClass.initialize(options)

Initializes the library with global configuration.

Options:

- `apiKey`: Your OpenAI API key (required)
- `service`: The AI service to use (default: 'openai')

### Exported Types

#### VibeClass<T>

A utility type that represents a class enhanced with dynamic method generation capabilities.

```ts
import { VibeClass } from 'vibe-class';

// Can be used for typing enhanced class instances
const user: VibeClass<User> = new EnhancedUser('John Doe', 'john@example.com');
```

## 🔧 Development

### Verbose Mode

For debugging and development purposes, you can enable verbose logging by setting the `VIBE_CLASS_VERBOSE` environment variable to `true`:

```bash
VIBE_CLASS_VERBOSE=true node your-script.js
```

This will log detailed information about method generation and execution, including:

- When dynamic methods are being generated
- The generated method bodies
- When cached methods are being called

## Warning

This is obviously a joke, **please** don't use it in your project.

## 📄 License

MIT
