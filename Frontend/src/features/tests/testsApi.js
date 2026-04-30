import { baseApi } from '../../shared/store/baseApi';

export const testsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTests: builder.query({
      query: (params = '') => `/tests${params}`,
      providesTags: ['Test'],
    }),
    createTest: builder.mutation({
      query: (data) => ({
        url: '/tests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Test'],
    }),
    getTestResults: builder.query({
      query: (testId) => `/tests/${testId}/results`,
      providesTags: ['Test'],
    }),
    saveTestResults: builder.mutation({
      query: ({ testId, results }) => ({
        url: `/tests/${testId}/results`,
        method: 'POST',
        body: { results },
      }),
      invalidatesTags: ['Test'],
    }),
  }),
});

export const {
  useGetTestsQuery,
  useCreateTestMutation,
  useGetTestResultsQuery,
  useSaveTestResultsMutation,
} = testsApi;