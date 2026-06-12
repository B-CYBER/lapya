import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { clearToken, getToken, setToken } from "@/lib/api";
import {
  getMe,
  login as loginRequest,
  signup as signupRequest,
  type LoginInput,
  type SignupInput,
} from "@/services/auth";
import type { TokenResponse, User } from "@/types/user";

const ME_KEY = ["me"] as const;

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const meQuery = useQuery<User>({
    queryKey: ME_KEY,
    queryFn: getMe,
    enabled: !!getToken(),
    retry: false,
  });

  const handleSuccess = (data: TokenResponse) => {
    setToken(data.accessToken);
    queryClient.setQueryData<User>(ME_KEY, data.user);
  };

  const signupMutation = useMutation<TokenResponse, Error, SignupInput>({
    mutationFn: signupRequest,
    onSuccess: handleSuccess,
  });

  const loginMutation = useMutation<TokenResponse, Error, LoginInput>({
    mutationFn: loginRequest,
    onSuccess: handleSuccess,
  });

  const logout = () => {
    clearToken();
    queryClient.removeQueries({ queryKey: ME_KEY });
    queryClient.clear();
    navigate("/welcome", { replace: true });
  };

  return {
    user: meQuery.data ?? null,
    isLoading: meQuery.isLoading,
    isAuthenticated: !!meQuery.data,
    signup: signupMutation,
    login: loginMutation,
    logout,
  };
}
