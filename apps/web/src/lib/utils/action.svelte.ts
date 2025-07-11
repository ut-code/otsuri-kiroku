export function useAction<T, E>(
  action: () => Promise<{ data: T; error: null } | { error: E; data: null }>,
) {
  const execute = async () => {
    if (state.processing) {
      return;
    }
    state.error = null;
    state.data = null;
    state.processing = true;

    try {
      const result = await action();
      if (result.error !== null) {
        state.error = result.error;
      }
      if (result.data !== null) {
        state.data = result.data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      state.processing = false;
    }
  };

  const state = $state<{
    processing: boolean;
    data: T | null;
    error: E | null;
    execute: () => Promise<void>;
  }>({
    processing: false,
    error: null,
    data: null,
    execute,
  });

  return state;
}
