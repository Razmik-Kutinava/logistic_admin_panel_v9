import { Component, createSignal, onMount, Show } from 'solid-js';
import { usersApi, type User } from '../services/api';
import './UsersTab.css';

const UsersTab: Component = () => {
  const [users, setUsers] = createSignal<User[]>([]);
  const [loading, setLoading] = createSignal(false);
  const [showForm, setShowForm] = createSignal(false);
  const [formData, setFormData] = createSignal({
    email: '',
    name: '',
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      alert('Ошибка загрузки пользователей');
    } finally {
      setLoading(false);
    }
  };

  onMount(loadUsers);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    try {
      const data = { ...formData() };
      if (!data.name) delete data.name;
      await usersApi.create(data);
      setShowForm(false);
      setFormData({ email: '', name: '' });
      loadUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Ошибка создания пользователя');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить пользователя?')) return;
    try {
      await usersApi.delete(id);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Ошибка удаления пользователя');
    }
  };

  return (
    <div class="users-tab">
      <div class="tab-header">
        <h2>Пользователи</h2>
        <button class="btn-primary" onClick={() => setShowForm(true)}>
          + Добавить пользователя
        </button>
      </div>

      <Show when={showForm()}>
        <form class="form" onSubmit={handleSubmit}>
          <h3>Новый пользователь</h3>
          <input
            type="email"
            placeholder="Email *"
            value={formData().email}
            onInput={(e) => setFormData({ ...formData(), email: e.currentTarget.value })}
            required
          />
          <input
            type="text"
            placeholder="Имя"
            value={formData().name}
            onInput={(e) => setFormData({ ...formData(), name: e.currentTarget.value })}
          />
          <div class="form-actions">
            <button type="submit" class="btn-primary">Создать</button>
            <button type="button" class="btn-secondary" onClick={() => setShowForm(false)}>
              Отмена
            </button>
          </div>
        </form>
      </Show>

      <Show when={!loading()} fallback={<div class="loading">Загрузка...</div>}>
        <div class="users-grid">
          {users().map((user) => (
            <div class="card">
              <div class="card-header">
                <h3>{user.name || user.email}</h3>
              </div>
              <div class="card-body">
                <p><strong>Email:</strong> {user.email}</p>
                <Show when={user.name}>
                  <p><strong>Имя:</strong> {user.name}</p>
                </Show>
                <p><strong>Создан:</strong> {new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
              </div>
              <div class="card-actions">
                <button class="btn-danger" onClick={() => handleDelete(user.id)}>
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

export default UsersTab;

