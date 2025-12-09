import { appApi } from '@/lib/appApi'

export const authApi = appApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body
      })
    })
  })
})

export const { useLoginMutation } = authApi
