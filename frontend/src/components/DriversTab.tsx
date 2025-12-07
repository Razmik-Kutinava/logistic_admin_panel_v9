import { Component, createSignal, onMount, Show } from 'solid-js';
import { driversApi, type Driver } from '../services/api';
import './DriversTab.css';

const DriversTab: Component = () => {
  const [drivers, setDrivers] = createSignal<Driver[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [showForm, setShowForm] = createSignal(false);
  const [formData, setFormData] = createSignal({
    name: '',
    phone: '',
    email: '',
    licenseNumber: '',
    status: 'active',
  });

  const loadDrivers = async () => {
    setLoading(true);
    try {
      const data = await driversApi.getAll();
      setDrivers(data);
    } catch (error) {
      console.error('Error loading drivers:', error);
      alert('Ошибка загрузки водителей');
    } finally {
      setLoading(false);
    }
  };

  onMount(loadDrivers);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      await driversApi.create(formData());
      setShowForm(false);
      setFormData({ name: '', phone: '', email: '', licenseNumber: '', status: 'active' });
      loadDrivers();
    } catch (error) {
      console.error('Error creating driver:', error);
      alert('Ошибка создания водителя');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить водителя?')) return;
    try {
      await driversApi.delete(id);
      loadDrivers();
    } catch (error) {
      console.error('Error deleting driver:', error);
      alert('Ошибка удаления водителя');
    }
  };

  return (
    <div class="drivers-tab">
      <div class="tab-header">
        <h2>Водители</h2>
        <button class="btn-primary" onClick={() => setShowForm(true)}>
          + Добавить водителя
        </button>
      </div>

      <Show when={showForm()}>
        <form class="form" onSubmit={handleSubmit}>
          <h3>Новый водитель</h3>
          <input
            type="text"
            placeholder="Имя *"
            value={formData().name}
            onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
            required
          />
          <input
            type="tel"
            placeholder="Телефон *"
            value={formData().phone}
            onInput={(e) => setFormData({ ...formData(), phone: e.currentTarget.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData().email}
            onInput={(e) => setFormData({ ...formData(), email: e.currentTarget.value })}
          />
          <input
            type="text"
            placeholder="Номер лицензии *"
            value={formData().licenseNumber}
            onInput={(e) => setFormData({ ...formData(), licenseNumber: e.currentTarget.value })}
            required
          />
          <select
            value={formData().status}
            onChange={(e) => setFormData({ ...formData(), status: e.currentTarget.value })}
          >
            <option value="active">Активен</option>
            <option value="inactive">Неактивен</option>
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
        <div class="drivers-grid">
          {drivers().map((driver) => (
            <div class="card">
              <div class="card-header">
                <h3>{driver.name}</h3>
                <span class={`badge ${driver.status}`}>{driver.status}</span>
              </div>
              <div class="card-body">
                <p><strong>Телефон:</strong> {driver.phone}</p>
                <Show when={driver.email}>
                  <p><strong>Email:</strong> {driver.email}</p>
                </Show>
                <p><strong>Лицензия:</strong> {driver.licenseNumber}</p>
                <Show when={driver.devices}>
                  <p><strong>Устройств:</strong> {driver.devices?.length || 0}</p>
                </Show>
                <Show when={driver.zones}>
                  <p><strong>Зон:</strong> {driver.zones?.length || 0}</p>
                </Show>
              </div>
              <div class="card-actions">
                <button class="btn-danger" onClick={() => handleDelete(driver.id)}>
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

export default DriversTab;

