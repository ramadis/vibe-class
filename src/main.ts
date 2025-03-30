import * as CodeCompletionService from './services/CodeCompletionService';
import { GenericClass, AnyFunction } from './utils/types';
import { verboseLog, isVerboseMode } from './utils/logger';
import { serializeFunctionCall } from './utils/serializer';

export type VibeClass<T> = T & {
  [key: string]: AnyFunction;
};

/**
 * Configuration options for vibe-class
 */
interface VibeClassOptions {
  apiKey: string;
  service?: 'openai'; // For future extension to support other AI services
}

/**
 * Extends a class with dynamic method generation capabilities.
 *
 * @description
 * This higher-order function takes a regular class and returns a proxied version
 * that can dynamically generate methods at runtime when they're called but don't exist.
 * The generated methods are cached for subsequent calls.
 *
 * @param {GenericClass<T>} original - The original class to transform
 * @returns {GenericClass<VibeClass<T>>} A proxied version of the class with dynamic method support
 *
 * @example
 * // Initialize the library first
 * asVibeClass.initialize({ apiKey: 'your-openai-api-key' });
 *
 * // Then enhance your classes
 * const EnhancedUser = asVibeClass(User);
 * const user = new EnhancedUser();
 * // Method doesn't exist but will be dynamically generated
 * await user.calculateScore(data);
 */
function asVibeClass<T>(original: GenericClass<T>): GenericClass<VibeClass<T>> {
  const Cache: Record<PropertyKey, AnyFunction> = {};

  const cachedMethod =
    (receiver: unknown, name: PropertyKey) =>
    (...args: unknown[]) => {
      verboseLog(`Calling cached method: ${serializeFunctionCall(String(name), args)}`);
      return Cache[name].call(receiver, ...args);
    };

  const handler: ProxyHandler<GenericClass<T>> = {
    construct(target, args) {
      // Create the instance normally
      const instance = new target(...args);

      // Return a proxy for the instance
      return new Proxy(instance as object, {
        get(target, name, receiver) {
          // if the object has the method defined, use its original implementation
          if (name in target) {
            return Reflect.get(target, name, receiver);
          }

          // if the method is cached, retrieve it from there instead
          if (name in Cache) {
            verboseLog(`Using cached dynamic method: ${serializeFunctionCall(String(name), args)}`);
            return cachedMethod(receiver, name);
          }

          // if the method does not exist in the object, and has not been retrieved earlier
          // we need to generate it
          return async (...args: unknown[]) => {
            verboseLog(`Generating dynamic method: ${serializeFunctionCall(String(name), args)}`);

            // generate the method
            const method = await CodeCompletionService.generateMethod(original, {
              name: name.toString(),
              sample: args,
            });

            verboseLog(`Generated method body for: ${serializeFunctionCall(String(name), args)}`);
            verboseLog(method);

            // cache it
            Cache[name] = eval(`(${method})`);

            // return the cached method
            return cachedMethod(receiver, name)(...args);
          };
        },
      });
    },
  };

  // We have to use a type assertion here because TypeScript's type system
  // cannot fully express that a Proxy maintains the contract of the original constructor
  // while adding dynamic method support to instances
  return new Proxy(original, handler) as GenericClass<VibeClass<T>>;
}

/**
 * Set the global configuration for vibe-class
 */
asVibeClass.initialize = ({ apiKey, service = 'openai' }: VibeClassOptions): void => {
  if (service === 'openai') {
    CodeCompletionService.setApiKey(apiKey);
  } else {
    throw new Error(`Unsupported service: ${service}`);
  }

  // Log if verbose mode is enabled via environment variable
  if (isVerboseMode()) {
    verboseLog('Verbose mode enabled via VIBE_CLASS_VERBOSE=true');
  }
};

export default asVibeClass;
