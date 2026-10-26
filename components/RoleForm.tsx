"use client";

import { useActionState } from "react";

import { updateUserRole } from "@/actions/admin";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";
import { ROLES, type Role } from "@/lib/roles";

export function RoleForm({ userId, role }: { userId: string; role: Role }) {
  const [state, formAction, isPending] = useActionState(updateUserRole, INITIAL_ACTION_STATE);

  return (
    <form action={formAction} className="flex items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select name="role" defaultValue={role} className="input w-auto py-1" aria-label="Vai trò">
        {ROLES.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>
      <button type="submit" disabled={isPending} className="btn-outline py-1">
        Lưu
      </button>
      {state.message && (
        <span className={`text-xs ${state.ok ? "text-green-700" : "text-red-700"}`}>{state.message}</span>
      )}
    </form>
  );
}
