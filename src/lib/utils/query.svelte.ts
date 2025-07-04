import { untrack } from "svelte";

export function useQuery<T, E>(
  query: () => Promise<{ data: T; error: null } | { error: E; data: null }>,
) {
  const reload = async () => {
    if (untrack(() => state.loading)) {
      return;
    }
    state.error = null;
    state.data = null;
    state.loading = true;

    try {
      const result = await query();
      if (result.error !== null) {
        state.error = result.error;
      }
      if (result.data !== null) {
        state.data = result.data;
      }
    } catch (e) {
      console.error(e);
    } finally {
      state.loading = false;
    }
  };
  const state = $state<{
    data: T | null;
    error: E | null;
    loading: boolean;
    reload: () => Promise<void>;
  }>({
    loading: false,
    data: null,
    error: null,
    reload,
  });

  $effect(() => {
    reload();
  });

  return state;
}
