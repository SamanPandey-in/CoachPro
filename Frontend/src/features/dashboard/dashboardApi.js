import { baseApi } from '../../shared/store/baseApi';

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => '/analytics/dashboard',
      providesTags: ['User'],
    }),
  }),
});

export const { useGetDashboardStatsQuery } = dashboardApi;