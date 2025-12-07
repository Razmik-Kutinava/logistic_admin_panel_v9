import { Component, createSignal } from 'solid-js';
import DriversTab from './components/DriversTab';
import DevicesTab from './components/DevicesTab';
import ZonesTab from './components/ZonesTab';
import UsersTab from './components/UsersTab';
import './App.css';

type Tab = 'drivers' | 'devices' | 'zones' | 'users';

const App: Component = () => {
  const [activeTab, setActiveTab] = createSignal<Tab>('drivers');

  return (
    <div class="app">
      <header class="header">
        <h1>🚚 Logistics Dashboard</h1>
        <nav class="tabs">
          <button
            classList={{ active: activeTab() === 'drivers' }}
            onClick={() => setActiveTab('drivers')}
          >
            👤 Водители
          </button>
          <button
            classList={{ active: activeTab() === 'devices' }}
            onClick={() => setActiveTab('devices')}
          >
            📱 Устройства
          </button>
          <button
            classList={{ active: activeTab() === 'zones' }}
            onClick={() => setActiveTab('zones')}
          >
            📍 Зоны
          </button>
          <button
            classList={{ active: activeTab() === 'users' }}
            onClick={() => setActiveTab('users')}
          >
            👥 Пользователи
          </button>
        </nav>
      </header>
      <main class="main">
        {activeTab() === 'drivers' && <DriversTab />}
        {activeTab() === 'devices' && <DevicesTab />}
        {activeTab() === 'zones' && <ZonesTab />}
        {activeTab() === 'users' && <UsersTab />}
      </main>
    </div>
  );
};

export default App;
