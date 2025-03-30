// Product example demonstrating asVibeClass for e-commerce use case
import { default as asVibeClass } from '../dist/index.esm.js';

// Initialize the library with your OpenAI API key
// Replace with your actual API key or use environment variables
const API_KEY = process.env.OPENAI_API_KEY;
asVibeClass.initialize({ apiKey: API_KEY });

// To enable verbose logging (for development):
// Set VIBE_CLASS_VERBOSE=true environment variable before running this example
// e.g., VIBE_CLASS_VERBOSE=true node examples/product-example.js

// Define a Product class for an e-commerce platform
class Product {
  constructor(name, price, category, description) {
    this.name = name;
    this.price = price;
    this.category = category;
    this.description = description;
    this.reviews = [];
  }

  getPrice() {
    return this.price;
  }
  
  addReview(review) {
    this.reviews.push(review);
  }
  
  getReviews() {
    return this.reviews;
  }
}

// Enhance the Product class with dynamic method generation
const EnhancedProduct = asVibeClass(Product);

// Create product instances
const laptop = new EnhancedProduct(
  'UltraBook Pro',
  1299.99,
  'Electronics',
  'A powerful laptop with 16GB RAM, 512GB SSD, and 14-inch display'
);

const headphones = new EnhancedProduct(
  'NoiseCancel X3',
  249.99,
  'Audio',
  'Wireless noise-cancelling headphones with 30-hour battery life'
);

// Add some reviews
laptop.addReview({ user: 'TechGuru', rating: 4.5, text: 'Great performance for the price!' });
headphones.addReview({ user: 'AudioFan', rating: 5, text: 'Best sound quality I\'ve ever experienced.' });

async function analyzeProduct(product) {
  try {
    console.log(`Product: ${product.name}`);
    console.log(`Price: $${product.getPrice()}`);
    
    // Dynamic methods that will be generated at runtime
    const targetAudience = await product.suggestTargetAudience();
    console.log(`Target Audience: ${targetAudience}`);
    
    const marketingTagline = await product.generateMarketingTagline();
    console.log(`Marketing Tagline: ${marketingTagline}`);
    
    const similarProducts = await product.recommendSimilarProducts({ limit: 3 });
    console.log('Similar Products:', similarProducts);
    
    const sentimentAnalysis = await product.analyzeSentimentFromReviews();
    console.log('Review Sentiment Analysis:', sentimentAnalysis);
  } catch (error) {
    console.error('Error calling dynamic method:', error);
  }
}

async function runExample() {
  console.log('===== LAPTOP ANALYSIS =====');
  await analyzeProduct(laptop);
  
  console.log('\n===== HEADPHONES ANALYSIS =====');
  await analyzeProduct(headphones);
}

runExample(); 