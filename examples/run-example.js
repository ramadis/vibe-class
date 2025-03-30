#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Main function
async function main() {
  // Get the example name from command line arguments
  const exampleName = process.argv[2];
  
  if (!exampleName) {
    console.log('Available examples:');
    const exampleFiles = fs.readdirSync(__dirname)
      .filter(file => file.endsWith('-example.js') && !file.startsWith('run-example'));
    
    exampleFiles.forEach(file => {
      console.log(`  - ${file.replace('-example.js', '')}`);
    });
    
    console.log('\nUsage: npm run example "example-name"');
    process.exit(1);
  }
  
  // Construct the path to the example file
  const exampleFile = path.join(__dirname, `${exampleName}-example.js`);
  
  // Check if the example exists
  if (!fs.existsSync(exampleFile)) {
    console.error(`Error: Example '${exampleName}' not found.`);
    process.exit(1);
  }
  
  // Check for OpenAI API key
  if (!process.env.OPENAI_API_KEY) {
    console.warn('\nWARNING: OPENAI_API_KEY environment variable is not set.');
    console.warn('The example will use a placeholder API key that will not work.');
    console.warn('Please set your OpenAI API key:');
    console.warn('  export OPENAI_API_KEY=your-key-here\n');
  }
  
  console.log(`Running example: ${exampleName}\n`);
  
  // Run the example
  try {
    await import(exampleFile);
  } catch (error) {
    console.error(`Error running example: ${error.message}`);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
}); 