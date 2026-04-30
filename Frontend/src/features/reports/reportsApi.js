import { baseApi } from '../../shared/store/baseApi';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    generateStudentReport: builder.mutation({
      query: ({ studentId, month, year }) => ({
        url: `/reports/generate/student/${studentId}`,
        method: 'POST',
        body: { month, year },
      }),
      invalidatesTags: ['Report'],
    }),
    getStudentReports: builder.query({
      query: (studentId) => `/reports/student/${studentId}`,
      providesTags: ['Report'],
    }),
    sendMonthlyReport: builder.mutation({
      query: (data) => ({
        url: '/reports/send-monthly',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Report'],
    }),
  }),
});

export const {
  useGenerateStudentReportMutation,
  useGetStudentReportsQuery,
  useSendMonthlyReportMutation,
} = reportsApi;