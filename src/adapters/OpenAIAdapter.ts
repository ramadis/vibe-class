interface CompletionOptions {
  model?: string;
  max_tokens?: number;
  messages?: {
    role: 'system' | 'user';
    content: string;
  }[];
  response_format?: {
    type: 'json_schema';
    json_schema: {
      strict: boolean;
      name: string;
      schema: {
        type: string;
        properties: Record<string, unknown>;
        required: string[];
        additionalProperties: boolean;
      };
    };
  };
  reasoning_effort?: 'low' | 'medium' | 'high';
}

interface CompletionResponse {
  choices: {
    message: {
      content: string;
      role?: string;
    };
    index?: number;
    finish_reason?: string;
  }[];
}

export enum OpenAIModel {
  GPT4o = 'gpt-4o',
  O3Mini = 'o3-mini',
}

export default class OpenAIAdapter {
  private apiKey: string;
  private baseUrl: string = 'https://api.openai.com/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async createCompletion(options: CompletionOptions): Promise<CompletionResponse> {
    const url = `${this.baseUrl}/chat/completions`;

    // Set default model if not provided
    const payload = {
      model: options.model || OpenAIModel.O3Mini,
      ...options,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
    }

    return (await response.json()) as CompletionResponse;
  }

  // Helper method to get just the completion text
  async getCompletion(
    messages: CompletionOptions['messages'],
    options: Partial<Omit<CompletionOptions, 'messages'>> = {}
  ): Promise<string> {
    const response = await this.createCompletion({
      messages,
      ...options,
    });

    return response.choices[0]?.message.content.trim() || '';
  }
}
