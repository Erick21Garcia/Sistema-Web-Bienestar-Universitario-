import {
  confirmResetPassword,
  ConfirmResetPasswordInput,
  confirmSignIn,
  confirmSignUp,
  ConfirmSignUpInput,
  ConfirmSignUpOutput,
  fetchUserAttributes,
  FetchUserAttributesOutput,
  ResetPasswordOutput,
  SignInInput,
  signOut,
  signUp,
} from 'aws-amplify/auth';
import { AuthSignInOutput } from '@aws-amplify/auth/dist/esm/types';
import { useMemo, createContext, useState, useEffect, useCallback } from 'react';
import {
  AuthInterface,
  AuthProviderInterface,
  ChangePasswordInput,
  SignUpParameters,
} from '../../interface/auth/auth.interface';
import {
  changePasswordService,
  resendPasswordService,
  signInService,
} from '../../services/auth/authSingInService';
import { errorToString } from '../../error/messages/errorToString';

export const AuthContext = createContext<AuthInterface | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderInterface> = ({ children }) => {
  const [user, setUser] = useState<FetchUserAttributesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const setCurrentUser = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const userAttributes: FetchUserAttributesOutput = await fetchUserAttributes();
      setIsAuthenticated(!!userAttributes);
      setUser(userAttributes);
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        await setCurrentUser();
      } finally {
        setIsLoading(false);
      }
    };
    initializeAuth();
  }, []);

  const handleSignIn = useCallback(async (credentials: SignInInput): Promise<AuthSignInOutput> => {
    try {
      const response = await signInService(credentials);
      await setCurrentUser();
      return response;
    } catch (error) {
      throw new Error(errorToString(error));
    }
  }, []);

  const handleConfirmSignIn = useCallback(
    async (newPassword: string, attributes: { username: string }) => {
      const response = await confirmSignIn({
        challengeResponse: newPassword,
        options: { userAttributes: attributes },
      });
      await setCurrentUser();
      return response;
    },
    [],
  );

  const handleSignOut = useCallback(async (): Promise<void> => {
    try {
      await signOut();
      await setCurrentUser();
    } catch (error) {
      throw new Error(errorToString(error));
    }
  }, []);

  const handleResendPassword = async (username: string): Promise<ResetPasswordOutput> => {
    return resendPasswordService(username);
  };

  const handleChangePassword = async ({
    oldPassword,
    newPassword,
  }: ChangePasswordInput): Promise<void> => {
    return changePasswordService({ oldPassword, newPassword });
  };

  const handleConfirmResetPassword = async ({
    username,
    confirmationCode,
    newPassword,
  }: ConfirmResetPasswordInput): Promise<void> => {
    try {
      await confirmResetPassword({
        username,
        confirmationCode,
        newPassword,
      });
    } catch (error) {
      throw new Error(errorToString(error));
    }
  };

  const handleCreateUser = async ({ username, password, email, role }: SignUpParameters) => {
    try {
      await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            'custom:role': role,
            'custom:name': username,
          },
          autoSignIn: false,
        },
      });
    } catch (e) {
      throw new Error(errorToString(e));
    }
  };

  const handleSignUpConfirmation = async ({
    username,
    confirmationCode,
  }: ConfirmSignUpInput): Promise<ConfirmSignUpOutput | undefined> => {
    try {
      const response = await confirmSignUp({
        username,
        confirmationCode,
      });
      return response;
    } catch (error) {
      throw new Error(errorToString(error));
    }
  };

  

  const providerValue = useMemo(
    () => ({
      user,
      isAuthenticated,
      handleSignIn,
      handleConfirmSignIn,
      handleSignOut,
      handleResendPassword,
      handleChangePassword,
      handleConfirmResetPassword,
      handleCreateUser,
      handleSignUpConfirmation,
      isLoading,
    }),
    [user, isLoading, handleSignIn, handleSignOut, handleConfirmSignIn, isAuthenticated],
  );

  return <AuthContext.Provider value={providerValue}>{children}</AuthContext.Provider>;
};
