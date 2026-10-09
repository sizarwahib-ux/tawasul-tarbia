export const queryClientInstance = {
  // Simple shim if @tanstack/react-query isn't needed or we can provide an inline context
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: 1 }
  }
};
