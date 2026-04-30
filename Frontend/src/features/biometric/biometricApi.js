import { baseApi } from '../../shared/store/baseApi';

export const biometricApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDevices: builder.query({
      query: () => '/biometric/devices',
      providesTags: ['User'],
    }),
    createDevice: builder.mutation({
      query: (data) => ({
        url: '/biometric/devices',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    getMappings: builder.query({
      query: () => '/biometric/mappings',
      providesTags: ['Student'],
    }),
    createMapping: builder.mutation({
      query: (data) => ({
        url: '/biometric/mappings',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Student'],
    }),
  }),
});

export const { useGetDevicesQuery, useCreateDeviceMutation, useGetMappingsQuery, useCreateMappingMutation } = biometricApi;