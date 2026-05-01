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
    getInstituteUsers: builder.query({
      query: ({ instituteId, role = 'all' }) => ({
        url: `/institutes/${instituteId}/users${role && role !== 'all' ? `?role=${encodeURIComponent(role)}` : ''}`,
      }),
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
    createInstituteUser: builder.mutation({
      query: ({ instituteId, ...body }) => ({
        url: `/institutes/${instituteId}/users`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
    importInstituteUsers: builder.mutation({
      query: ({ instituteId, formData }) => ({
        url: `/institutes/${instituteId}/users/import`,
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['User'],
    }),
    exportInstituteUsers: builder.mutation({
      query: ({ instituteId, format = 'xlsx', role = 'all' }) => ({
        url: `/institutes/${instituteId}/users/export?format=${encodeURIComponent(format)}${role && role !== 'all' ? `&role=${encodeURIComponent(role)}` : ''}`,
        method: 'GET',
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetInstituteQuery,
  useGetInstituteStatsQuery,
  useGetInstituteUsersQuery,
  useUpdateInstituteMutation,
  useCreateInstituteUserMutation,
  useImportInstituteUsersMutation,
  useExportInstituteUsersMutation,
} = instituteApi;