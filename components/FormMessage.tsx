import type { ActionState } from "@/lib/action-state";

export function FormMessage({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p
      role={state.ok ? "status" : "alert"}
      className={`rounded-md p-2 text-sm ${state.ok ? "bg-green-50 text-green-800" : "bg-red-50 text-red-700"}`}
    >
      {state.message}
    </p>
  );
}
