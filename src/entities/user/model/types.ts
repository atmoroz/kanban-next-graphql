/** Текущий пользователь (ответ me, auth payload и т.д.) */
export type MeUser = {
  id: string;
  email: string;
  name: string | null;
};
