import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth';

export function useAuth() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: ({ data }) => {
      login(data.accessToken, data.refreshToken, data.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      logout();
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
  };
}
