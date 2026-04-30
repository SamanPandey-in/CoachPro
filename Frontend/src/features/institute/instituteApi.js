import { baseApi } from '../../shared/store/baseApi';

export const instituteApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInstitute: builder.query({
      query: (instituteId) => `/institutes/${instituteId}`,
      providesTags: ['User'],
    }),
    getInstituteStats: builder.query({
      query: (instituteId) => `/institutes/${instituteId}/stats`,
      providesTags: ['User'],
    }),
    updateInstitute: builder.mutation({
      query: ({ instituteId, ...body }) => ({
        url: `/institutes/${instituteId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetInstituteQuery, useGetInstituteStatsQuery, useUpdateInstituteMutation } = instituteApi;