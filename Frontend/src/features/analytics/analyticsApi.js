import { baseApi } from '../../shared/store/baseApi';

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getWeakStudents: builder.query({
      query: () => '/analytics/weak-students',
      providesTags: ['Student'],
    }),
    getBatchPerformance: builder.query({
      query: (batchId) => `/analytics/batch/${batchId}/performance`,
      providesTags: ['Batch'],
    }),
  }),
});

export const { useGetWeakStudentsQuery, useGetBatchPerformanceQuery } = analyticsApi;