import { Component, createSignal, onMount, Show } from 'solid-js';
import { devicesApi, driversApi, type Device, type Driver } from '../services/api';
import './DevicesTab.css';

const DevicesTab: Component = () => {
  const [devices, setDevices] = createSignal<Device[]>([]);
  const [drivers, setDrivers] = createSignal<Driver[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [showForm, setShowForm] = createSignal(false);
  const [formData, setFormData] = createSignal({
    name: '',
    imei: '',
    model: '',
    status: 'active',
    driverId: undefined as number | undefined,
  });

  const loadDevices = async () => {
    setLoading(true);
    try {
      const data = await devicesApi.getAll();
      setDevices(data);
    } catch (error) {
      console.error('Error loading devices:', error);
      alert('Ошибка загрузки устройств');
    } finally {
      setLoading(false);
    }
  };

  const loadDrivers = async () => {
    try {
      const data = await driversApi.getAll();
      setDrivers(data);
    } catch (error) {
      console.error('Error loading drivers:', error);
    }
  };

  onMount(() => {
    loadDevices();
    loadDrivers();
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const data = { ...formData() };
      if (!data.driverId) delete data.driverId;
      await devicesApi.create(data);
      setShowForm(false);
      setFormData({ name: '', imei: '', model: '', status: 'active', driverId: undefined });
      loadDevices();
    } catch (error) {
      console.error('Error creating device:', error);
      alert('Ошибка создания устройства');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить устройство?')) return;
    try {
      await devicesApi.delete(id);
      loadDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
      alert('Ошибка удаления устройства');
    }
  };

  return (
    <div class="devices-tab">
      <div class="tab-header">
        <h2>Устройства</h2>
        <button class="btn-primary" onClick={() => setShowForm(true)}>
          + Добавить устройство
        </button>
      </div>

      <Show when={showForm()}>
        <form class="form" onSubmit={handleSubmit}>
          <h3>Новое устройство</h3>
          <input
            type="text"
            placeholder="Название *"
            value={formData().name}
            onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
            required
          />
          <input
            type="text"
            placeholder="IMEI *"
            value={formData().imei}
            onInput={(e) => setFormData({ ...formData(), imei: e.currentTarget.value })}
            required
          />
          <input
            type="text"
            placeholder="Модель"
            value={formData().model}
            onInput={(e) => setFormData({ ...formData(), model: e.currentTarget.value })}
          />
          <select
            value={formData().status}
            onChange={(e) => setFormData({ ...formData(), status: e.currentTarget.value })}
          >
            <option value="active">Активно</option>
            <option value="inactive">Неактивно</option>
          </select>
          <select
            value={formData().driverId || ''}
            onChange={(e) => setFormData({ ...formData(), driverId: e.currentTarget.value ? parseInt(e.currentTarget.value) : undefined })}
          >
            <option value="">Без водителя</option>
            {drivers().map((driver) => (
              <option value={driver.id}>{driver.name}</option>
            ))}
          </select>
          <div class="form-actions">
            <button type="submit" class="btn-primary">Создать</button>
            <button type="button" class="btn-secondary" onClick={() => setShowForm(false)}>
              Отмена
            </button>
          </div>
        </form>
      </Show>

      <Show when={!loading()} fallback={<div class="loading">Загрузка...</div>}>
        <div class="devices-grid">
          {devices().map((device) => (
            <div class="card">
              <div class="card-header">
                <h3>{device.name}</h3>
                <span class={`badge ${device.status}`}>{device.status}</span>
              </div>
              <div class="card-body">
                <p><strong>IMEI:</strong> {device.imei}</p>
                <Show when={device.model}>
                  <p><strong>Модель:</strong> {device.model}</p>
                </Show>
                <Show when={device.driver}>
                  <p><strong>Водитель:</strong> {device.driver?.name}</p>
                </Show>
              </div>
              <div class="card-actions">
                <button class="btn-danger" onClick={() => handleDelete(device.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      </Show>
    </div>
  );
};

export default DevicesTab;

