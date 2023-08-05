export function useSession() {
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  if (token === null || userId === null || username === null) {
    return null;
  }
  return { token, userId, username };
}
