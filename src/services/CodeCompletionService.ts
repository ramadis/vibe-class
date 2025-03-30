import { GenericClass } from '../utils/types';
import OpenAIAdapter, { OpenAIModel } from '../adapters/OpenAIAdapter';
import { serializeFunctionCall } from '../utils/serializer';

// Initialize with a default adapter, but it will be ov
// erridden when a key is provided
let openai = new OpenAIAdapter('');

/**
 * Sets the OpenAI API key for the service
 * @param apiKey - The OpenAI API key
 */
export const setApiKey = (apiKey: string): void => {
  openai = new OpenAIAdapter(apiKey);
};

class CodeCompletionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CodeCompletionError';
  }
}

/**
 * Generate a method for a class
 * @param target - The class to generate the method for
 * @param name - The name of the method to generate
 * @param sample - An array of sample inputs to the method
 * @returns The generated method
 */
export const generateMethod = async <T>(
  target: GenericClass<T>,
  { name, sample }: { name: string; sample: unknown[] }
) => {
  try {
    const response = await openai.createCompletion({
      model: OpenAIModel.O3Mini,
      reasoning_effort: 'high',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'class_method',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              class_method: { type: 'string' },
            },
            required: ['class_method'],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: 'system',
          content: `
Write a JavaScript method function definition for the class \`${target.name}\` called \`${name}\` that fits within constraints. Assume no additional methods or properties are present. Do not change the method name or instantiate the class. Use only the information provided to infer method parameters. Ensure the function definition is complete and error-free.

# Steps

1. Define the function \`${name}\` within the context of the ${target.name} class.
2. Use any properties assumed to exist within the class without assuming undefined properties.
3. Ensure that the method definition begins with the \`function\` keyword and includes opening and closing braces.
4. Validate that the method definition is able to stand alone and integrates seamlessly into the class.

# Output Format

Provide only the function definition starting with the \`function\` keyword. No extra code or comments should be included. Ensure that the response is a fully operational method.

# Notes

- Do not instantiate or assume existence of other methods or properties.
- Follow the naming requirement strictly and infer other details cautiously, based on standard naming conventions or logical assumptions.
- The method must be defined as part of a class and respond within these constraints.`,
        },
        {
          role: 'user',
          content: `
<class>
    ${target.toString()}
</class>
<sample>
    const instance = new ${target.name}(...);
    instance.${serializeFunctionCall(name, sample)}
</sample>
<return>
  function ${name}(...) {...}
</return>`,
        },
      ],
    });

    const formattedResponse = JSON.parse(response.choices[0].message.content);
    return formattedResponse.class_method;
  } catch (error) {
    throw new CodeCompletionError(`failed to generate method: ${error}`);
  }
};
