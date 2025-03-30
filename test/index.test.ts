import asVibeClass, { type VibeClass } from '../src';

// Mock the CodeCompletionService
jest.mock('../src/services/CodeCompletionService', () => ({
  generateMethod: jest.fn().mockImplementation((_, { name }) => {
    // Return different implementations based on method name for more realistic testing
    if (name === 'methodWithParams') {
      return Promise.resolve(`function ${name}(a, b) { return a + b; }`);
    } else if (name === 'methodWithError') {
      return Promise.resolve(`function ${name}() { throw new Error('Test error'); }`);
    } else if (name === 'asyncMethod') {
      return Promise.resolve(`async function ${name}() { return Promise.resolve(42); }`);
    } else if (name === 'accessProperty') {
      return Promise.resolve(`function ${name}() { return this.property; }`);
    } else {
      return Promise.resolve(`function ${name}() { return 2; }`);
    }
  }),
  setApiKey: jest.fn(),
}));

class TestClass {
  property = 'property value';

  existingMethod() {
    return 'original method';
  }

  methodWithArgs(a: number, b: number) {
    return a * b;
  }
}

class EmptyClass {}

describe('asVibeClass', () => {
  let instance: VibeClass<TestClass>;
  let evalSpy: jest.SpyInstance;
  let generateMethodSpy: jest.SpyInstance;

  beforeEach(() => {
    // Create spies
    evalSpy = jest.spyOn(global, 'eval');
    generateMethodSpy = jest.spyOn(
      require('../src/services/CodeCompletionService'),
      'generateMethod'
    );

    // Create new instance for each test
    const VibeClass = asVibeClass(TestClass);
    instance = new VibeClass();
  });

  afterEach(() => {
    evalSpy.mockRestore();
    generateMethodSpy.mockClear();
  });

  it('should preserve existing methods', () => {
    expect(instance.existingMethod()).toBe('original method');
    expect(evalSpy).not.toHaveBeenCalled();
  });

  it('should preserve methods with arguments', () => {
    expect(instance.methodWithArgs(3, 4)).toBe(12);
    expect(evalSpy).not.toHaveBeenCalled();
  });

  it('should dynamically create missing methods', async () => {
    // @ts-ignore: Property 'nonExistingMethod' does not exist
    const result = await instance.nonExistingMethod();
    expect(result).toBe(2);
    expect(evalSpy).toHaveBeenCalled();
    expect(generateMethodSpy).toHaveBeenCalledWith(TestClass, {
      name: 'nonExistingMethod',
      sample: [],
    });

    // Clear the mocks
    evalSpy.mockClear();
    generateMethodSpy.mockClear();

    // Test with other primitive-returning methods
    jest
      .mocked(require('../src/services/CodeCompletionService').generateMethod)
      .mockImplementationOnce(() => {
        return Promise.resolve('function booleanMethod() { return true; }');
      });

    expect(await instance.booleanMethod()).toBe(true);
  });

  it('should handle methods with parameters correctly', async () => {
    const result = await instance.methodWithParams(5, 7);
    expect(result).toBe(12);
    expect(generateMethodSpy).toHaveBeenCalledWith(TestClass, {
      name: 'methodWithParams',
      sample: [5, 7],
    });
  });

  it('should properly handle async methods', async () => {
    const result = await instance.asyncMethod();
    expect(result).toBe(42);
  });

  it('should access instance properties correctly', async () => {
    const result = await instance.accessProperty();
    expect(result).toBe('property value');
  });

  it('should cache generated methods', async () => {
    // First call should create the method
    // @ts-ignore: Property 'cachedMethod' does not exist
    await instance.cachedMethod();
    expect(evalSpy).toHaveBeenCalled();
    expect(generateMethodSpy).toHaveBeenCalledTimes(1);

    // Reset the mocks
    evalSpy.mockClear();
    generateMethodSpy.mockClear();

    // Second call should use cached version
    // @ts-ignore: Property 'cachedMethod' does not exist
    await instance.cachedMethod();

    // Eval and generateMethod should not be called for the second invocation
    expect(evalSpy).not.toHaveBeenCalled();
    expect(generateMethodSpy).not.toHaveBeenCalled();
  });

  it('should handle errors thrown by generated methods', async () => {
    // Capture the actual error object
    let caughtError: Error | undefined;
    try {
      await instance.methodWithError();
    } catch (error) {
      caughtError = error as Error;
    }

    // Verify error message
    expect(caughtError).toBeDefined();
    expect(caughtError?.message).toBe('Test error');

    // Verify method was actually generated
    expect(generateMethodSpy).toHaveBeenCalledWith(TestClass, {
      name: 'methodWithError',
      sample: [],
    });
  });

  it('should forward constructor arguments to the original class', () => {
    class ClassWithConstructor {
      public value: string;

      constructor(value: string) {
        this.value = value;
      }

      getValue() {
        return this.value;
      }
    }

    const EnhancedClass = asVibeClass(ClassWithConstructor);
    const enhancedInstance = new EnhancedClass('test value');

    expect(enhancedInstance.getValue()).toBe('test value');
  });

  it('should work with empty classes', async () => {
    const EmptyVibeClass = asVibeClass(EmptyClass);
    const emptyInstance = new EmptyVibeClass();

    const result = await emptyInstance.someMethod();
    expect(result).toBe(2);
  });

  it('should pass the correct samples to the code generation service', async () => {
    await instance.complexMethod('string', 123, { key: 'value' });

    expect(generateMethodSpy).toHaveBeenCalledWith(TestClass, {
      name: 'complexMethod',
      sample: ['string', 123, { key: 'value' }],
    });
  });

  it('should maintain the prototype chain', () => {
    expect(instance instanceof TestClass).toBe(true);
  });

  it('should handle Symbol properties', () => {
    const symbolProp = Symbol('testSymbol');
    // @ts-ignore: We need to bypass TypeScript checking here
    instance[symbolProp] = 'symbol value';
    // @ts-ignore: Accessing Symbol property
    expect(instance[symbolProp]).toBe('symbol value');
  });

  it('should handle property getters and setters', () => {
    class ClassWithAccessors {
      private _value: string = '';

      get value() {
        return this._value;
      }

      set value(newValue: string) {
        this._value = newValue;
      }
    }

    const EnhancedClass = asVibeClass(ClassWithAccessors);
    const enhancedInstance = new EnhancedClass();

    enhancedInstance.value = 'test';
    expect(enhancedInstance.value).toBe('test');
  });

  it('should handle special property names', async () => {
    await instance['$special_name']();
    expect(generateMethodSpy).toHaveBeenCalledWith(TestClass, {
      name: '$special_name',
      sample: [],
    });
  });

  it('should handle inherited methods', () => {
    class BaseClass {
      baseMethod() {
        return 'base method';
      }
    }

    class ChildClass extends BaseClass {}

    const EnhancedChildClass = asVibeClass(ChildClass);
    const childInstance = new EnhancedChildClass();

    expect(childInstance.baseMethod()).toBe('base method');
    expect(evalSpy).not.toHaveBeenCalled();
  });

  it('should properly handle errors from the code generation service', async () => {
    // Mock the code generation service to throw an error
    jest
      .mocked(require('../src/services/CodeCompletionService').generateMethod)
      .mockImplementationOnce(() => {
        return Promise.reject(new Error('API error'));
      });

    // Calling a non-existent method should now fail
    await expect(instance.methodThatFails()).rejects.toThrow();
  });

  it('should handle invalid code from the generation service', async () => {
    // Mock the code generation service to return invalid JavaScript
    jest
      .mocked(require('../src/services/CodeCompletionService').generateMethod)
      .mockImplementationOnce(() => {
        return Promise.resolve('function invalidSyntax() { return @#$%; }');
      });

    // Capture the specific error to verify it's a syntax error
    let syntaxError: Error | undefined;
    try {
      await instance.invalidSyntax();
    } catch (error) {
      syntaxError = error as Error;
    }

    expect(syntaxError).toBeDefined();
    expect(syntaxError instanceof SyntaxError).toBe(true);
  });

  describe('initialize', () => {
    it('should set the API key for OpenAI service', () => {
      const setApiKeySpy = jest.spyOn(
        require('../src/services/CodeCompletionService'),
        'setApiKey'
      );

      asVibeClass.initialize({ apiKey: 'test-api-key' });

      expect(setApiKeySpy).toHaveBeenCalledWith('test-api-key');
      setApiKeySpy.mockRestore();
    });

    it('should throw an error for unsupported services', () => {
      expect(() => {
        // @ts-ignore: Type '"unsupported"' is not assignable to type '"openai"'
        asVibeClass.initialize({ apiKey: 'test-api-key', service: 'unsupported' });
      }).toThrow('Unsupported service: unsupported');
    });
  });
});
