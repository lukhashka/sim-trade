import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Реєстрація (вже була)
    register: builder.mutation({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
    }),
    // 👇 НОВЕ: Вхід у систему
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    getWallet: builder.query({
      query: () => ({
        url: "/wallet",
        method: "GET",
        // Токен додається автоматично? Поки ні. Треба налаштувати заголовки.
      }),
    }),
  }),
});

// Експортуємо обидва хуки
export const { useRegisterMutation, useLoginMutation, useGetWalletQuery } = api;
