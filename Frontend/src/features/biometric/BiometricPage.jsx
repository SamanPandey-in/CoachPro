import { useState } from 'react';
import { useCreateDeviceMutation, useCreateMappingMutation, useGetDevicesQuery, useGetMappingsQuery } from './biometricApi';

export default function BiometricPage() {
  const { data: devicesData } = useGetDevicesQuery();
  const { data: mappingsData } = useGetMappingsQuery();
  const [createDevice, { isLoading: creatingDevice }] = useCreateDeviceMutation();
  const [createMapping, { isLoading: creatingMapping }] = useCreateMappingMutation();
  const [deviceForm, setDeviceForm] = useState({ device_name: '', device_serial: '', location: '' });
  const [mappingForm, setMappingForm] = useState({ device_id: '', device_user_id: '', student_id: '' });

  const devices = devicesData?.data || [];
  const mappings = mappingsData?.data || [];

  const handleDeviceSubmit = async (event) => {
    event.preventDefault();
    await createDevice(deviceForm).unwrap();
    setDeviceForm({ device_name: '', device_serial: '', location: '' });
  };

  const handleMappingSubmit = async (event) => {
    event.preventDefault();
    await createMapping(mappingForm).unwrap();
    setMappingForm({ device_id: '', device_user_id: '', student_id: '' });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-surface-900">Biometric</h1>
        <p className="text-surface-500 text-sm mt-1">Manage devices and student mappings</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <form className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 space-y-3" onSubmit={handleDeviceSubmit}>
          <h2 className="text-base font-semibold text-surface-900">Add Device</h2>
          <input className="input-field" placeholder="Device name" value={deviceForm.device_name} onChange={(event) => setDeviceForm((current) => ({ ...current, device_name: event.target.value }))} />
          <input className="input-field" placeholder="Serial number" value={deviceForm.device_serial} onChange={(event) => setDeviceForm((current) => ({ ...current, device_serial: event.target.value }))} />
          <input className="input-field" placeholder="Location" value={deviceForm.location} onChange={(event) => setDeviceForm((current) => ({ ...current, location: event.target.value }))} />
          <button className="btn-primary" disabled={creatingDevice}>Add device</button>
        </form>

        <form className="bg-white rounded-xl border border-surface-200 shadow-sm p-6 space-y-3" onSubmit={handleMappingSubmit}>
          <h2 className="text-base font-semibold text-surface-900">Create Mapping</h2>
          <input className="input-field" placeholder="Device ID" value={mappingForm.device_id} onChange={(event) => setMappingForm((current) => ({ ...current, device_id: event.target.value }))} />
          <input className="input-field" placeholder="Device user ID" value={mappingForm.device_user_id} onChange={(event) => setMappingForm((current) => ({ ...current, device_user_id: event.target.value }))} />
          <input className="input-field" placeholder="Student ID" value={mappingForm.student_id} onChange={(event) => setMappingForm((current) => ({ ...current, student_id: event.target.value }))} />
          <button className="btn-primary" disabled={creatingMapping}>Save mapping</button>
        </form>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-surface-900 mb-4">Devices</h2>
          <div className="space-y-3">
            {devices.map((device) => (
              <div key={device.id} className="rounded-lg border border-surface-200 px-4 py-3 text-sm">
                <p className="font-medium text-surface-900">{device.device_name}</p>
                <p className="text-surface-500">{device.location || 'No location'}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-surface-900 mb-4">Mappings</h2>
          <div className="space-y-3">
            {mappings.map((mapping) => (
              <div key={mapping.id} className="rounded-lg border border-surface-200 px-4 py-3 text-sm">
                <p className="font-medium text-surface-900">{mapping.student_name}</p>
                <p className="text-surface-500">{mapping.device_name} · {mapping.device_user_id}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}