export function useSession() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  if (token === null || userId === null) {
    return null;
  }
  return { token, userId };
}
