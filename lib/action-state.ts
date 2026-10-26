/** Kết quả trả về của mọi Server Action dùng với useActionState. */
export interface ActionState {
  ok: boolean;
  message: string;
}

export const INITIAL_ACTION_STATE: ActionState = { ok: false, message: "" };
