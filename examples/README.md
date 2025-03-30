# vibe-class Examples

This directory contains example implementations that demonstrate how to use the `vibe-class` library to dynamically generate methods for your classes.

## Prerequisites

Before running the examples, make sure you have:

1. Built the package with `npm run build`
2. Set your OpenAI API key as an environment variable:
   ```bash
   export OPENAI_API_KEY=your-openai-api-key
   ```

## Running Examples

You can run any example using:

```bash
npm run example "example-name"
```

For instance:

```bash
# Run the user example
npm run example user
```

If you run without specifying an example, you'll see a list of available examples:

```bash
npm run example
```

## Available Examples

1. **user** - Demonstrates using `asVibeClass` with a simple User class

## How It Works

Each example follows this pattern:

1. Initialize the library with your OpenAI API key
2. Define a regular class with some methods
3. Enhance the class using `asVibeClass`
4. Create an instance of the enhanced class
5. Call both existing methods and new methods that don't exist yet

When you call a method that doesn't exist, `vibe-class` will dynamically generate it based on the method name and arguments.

## Creating Your Own Examples

To create a new example:

1. Create a file named `your-example-name-example.js` in this directory
2. Follow the pattern in the existing examples
3. Run it with `npm run example "your-example-name"`
