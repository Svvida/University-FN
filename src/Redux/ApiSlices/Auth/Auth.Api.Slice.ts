import Api from 'Redux/Config/Api';
import { extendedOnQueryStartedWithNotifications } from 'Utils/Slices/ExtendedOnQueryStarted';
import { logOut, setCredentials } from '../../StateSlices/Auth/Auth.State.Slice';
import type {
  ILoginRequest,
  ILoginResponse,
  ILogoutResponse,
  IRefreshRequest,
  IRefreshResponse,
} from 'Contract/Slices/Auth/Auth';

const authApiSlice = Api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<ILoginResponse, ILoginRequest>({
      query: credentials => ({
        url: '/auth',
        method: 'POST',
        body: credentials,
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Login successful!',
        successCallback: (data, dispatch) => {
          dispatch(setCredentials({ accessToken: data.accessToken }));
        },
      }),
    }),

    sendLogout: builder.mutation<ILogoutResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Logout successful',
        successCallback: (_data, dispatch) => {
          dispatch(logOut());
          dispatch(Api.util.resetApiState());
        },
      }),
    }),

    refresh: builder.mutation<IRefreshResponse, IRefreshRequest>({
      query: ({ sessionID }) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: {
          sessionID,
        },
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Token refreshed',
        successCallback: (data, dispatch) => {
          dispatch(setCredentials({ accessToken: data.accessToken }));
        },
      }),
    }),

    randomLogin: builder.mutation<ILoginResponse, { sessionID: string }>({
      query: ({ sessionID }) => ({
        url: '/auth/random-login',
        method: 'POST',
        body: { sessionID },
      }),
      onQueryStarted: extendedOnQueryStartedWithNotifications({
        successMessage: 'Random login successful!',
        successCallback: (data, dispatch) => {
          dispatch(setCredentials({ accessToken: data.accessToken }));
        },
      }),
    }),
  }),
});

export const { useLoginMutation, useSendLogoutMutation, useRefreshMutation, useRandomLoginMutation } = authApiSlice;
export default authApiSlice;