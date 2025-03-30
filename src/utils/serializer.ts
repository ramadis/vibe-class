export const serializeFunctionCall = (functionName: string, args: unknown[]) => {
  return `${functionName}(${args
    .map(arg =>
      typeof arg === 'object' && arg !== null ? JSON.stringify(arg) : new String(arg).toString()
    )
    .join(', ')})`;
};
