import { Component, createSignal, onMount, Show } from 'solid-js';
import { zonesApi, driversApi, type Zone, type Driver } from '../services/api';
import './ZonesTab.css';

const ZonesTab: Component = () => {
  const [zones, setZones] = createSignal<Zone[]>([]);
  const [drivers, setDrivers] = createSignal<Driver[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [showForm, setShowForm] = createSignal(false);
  const [formData, setFormData] = createSignal({
    name: '',
    address: '',
    city: '',
    zipCode: '',
    status: 'active',
    driverId: undefined as number | undefined,
  });

  const loadZones = async () => {
    setLoading(true);
    try {
      const data = await zonesApi.getAll();
      setZones(data);
    } catch (error) {
      console.error('Error loading zones:', error);
      alert('Ошибка загрузки зон');
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
    loadZones();
    loadDrivers();
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const data = { ...formData() };
      if (!data.driverId) delete data.driverId;
      if (!data.zipCode) delete data.zipCode;
      await zonesApi.create(data);
      setShowForm(false);
      setFormData({ name: '', address: '', city: '', zipCode: '', status: 'active', driverId: undefined });
      loadZones();
    } catch (error) {
      console.error('Error creating zone:', error);
      alert('Ошибка создания зоны');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить зону?')) return;
    try {
      await zonesApi.delete(id);
      loadZones();
    } catch (error) {
      console.error('Error deleting zone:', error);
      alert('Ошибка удаления зоны');
    }
  };

  return (
    <div class="zones-tab">
      <div class="tab-header">
        <h2>Зоны</h2>
        <button class="btn-primary" onClick={() => setShowForm(true)}>
          + Добавить зону
        </button>
      </div>

      <Show when={showForm()}>
        <form class="form" onSubmit={handleSubmit}>
          <h3>Новая зона</h3>
          <input
            type="text"
            placeholder="Название *"
            value={formData().name}
            onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
            required
          />
          <input
            type="text"
            placeholder="Адрес *"
            value={formData().address}
            onInput={(e) => setFormData({ ...formData(), address: e.currentTarget.value })}
            required
          />
          <input
            type="text"
            placeholder="Город *"
            value={formData().city}
            onInput={(e) => setFormData({ ...formData(), city: e.currentTarget.value })}
            required
          />
          <input
            type="text"
            placeholder="Почтовый индекс"
            value={formData().zipCode}
            onInput={(e) => setFormData({ ...formData(), zipCode: e.currentTarget.value })}
          />
          <select
            value={formData().status}
            onChange={(e) => setFormData({ ...formData(), status: e.currentTarget.value })}
          >
            <option value="active">Активна</option>
            <option value="inactive">Неактивна</option>
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
        <div class="zones-grid">
          {zones().map((zone) => (
            <div class="card">
              <div class="card-header">
                <h3>{zone.name}</h3>
                <span class={`badge ${zone.status}`}>{zone.status}</span>
              </div>
              <div class="card-body">
                <p><strong>Адрес:</strong> {zone.address}</p>
                <p><strong>Город:</strong> {zone.city}</p>
                <Show when={zone.zipCode}>
                  <p><strong>Индекс:</strong> {zone.zipCode}</p>
                </Show>
                <Show when={zone.driver}>
                  <p><strong>Водитель:</strong> {zone.driver?.name}</p>
                </Show>
              </div>
              <div class="card-actions">
                <button class="btn-danger" onClick={() => handleDelete(zone.id)}>
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

export default ZonesTab;

