// User example demonstrating asVibeClass functionality
import { default as asVibeClass } from '../dist/index.esm.js';

// Initialize the library with your OpenAI API key
// Replace with your actual API key or use environment variables
const API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key';
asVibeClass.initialize({ apiKey: API_KEY });

// Define a simple User class
class User {
  constructor(firstName, lastName, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }

  getEmail() {
    return this.email;
  }

  // Methods like getAge, calculateScore, etc. will be dynamically generated
}

// Enhance the User class with dynamic method generation
const EnhancedUser = asVibeClass(User);

// Create instances
const john = new EnhancedUser('John', 'Doe', 'john@example.com');
const jane = new EnhancedUser('Jane', 'Doe', 'jane@example.com');

async function testUser(user) {
  try {
    console.log(`Email: ${user.getEmail()}`);
    const fullName = await user.getFullName();
    console.log(`Full Name: ${fullName}`);
    // This will be dynamically generated based on the method name and arguments
    const age = await user.getAge({ birthYear: 1990 });
    console.log(`Age: ${age}`);
  } catch (error) {
    console.error('Error calling dynamic method:', error);
  }
}

async function runExample() {
  await testUser(john);
  await testUser(jane);
}

runExample();