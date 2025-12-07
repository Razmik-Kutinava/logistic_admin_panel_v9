const API_BASE_URL = 'http://localhost:3000';

export interface Driver {
  id: number;
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  status: string;
  devices?: Device[];
  zones?: Zone[];
  createdAt: string;
  updatedAt: string;
}

export interface Device {
  id: number;
  name: string;
  imei: string;
  model?: string;
  status: string;
  driverId?: number;
  driver?: Driver;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: number;
  name: string;
  address: string;
  city: string;
  zipCode?: string;
  status: string;
  driverId?: number;
  driver?: Driver;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

// Drivers API
export const driversApi = {
  getAll: async (): Promise<Driver[]> => {
    const res = await fetch(`${API_BASE_URL}/driver`);
    return res.json();
  },
  getOne: async (id: number): Promise<Driver> => {
    const res = await fetch(`${API_BASE_URL}/driver/${id}`);
    return res.json();
  },
  create: async (data: Partial<Driver>): Promise<Driver> => {
    const res = await fetch(`${API_BASE_URL}/driver`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: number, data: Partial<Driver>): Promise<Driver> => {
    const res = await fetch(`${API_BASE_URL}/driver/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/driver/${id}`, { method: 'DELETE' });
  },
};

// Devices API
export const devicesApi = {
  getAll: async (): Promise<Device[]> => {
    const res = await fetch(`${API_BASE_URL}/devices`);
    return res.json();
  },
  getOne: async (id: number): Promise<Device> => {
    const res = await fetch(`${API_BASE_URL}/devices/${id}`);
    return res.json();
  },
  create: async (data: Partial<Device>): Promise<Device> => {
    const res = await fetch(`${API_BASE_URL}/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: number, data: Partial<Device>): Promise<Device> => {
    const res = await fetch(`${API_BASE_URL}/devices/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/devices/${id}`, { method: 'DELETE' });
  },
};

// Zones API
export const zonesApi = {
  getAll: async (): Promise<Zone[]> => {
    const res = await fetch(`${API_BASE_URL}/zones`);
    return res.json();
  },
  getOne: async (id: number): Promise<Zone> => {
    const res = await fetch(`${API_BASE_URL}/zones/${id}`);
    return res.json();
  },
  create: async (data: Partial<Zone>): Promise<Zone> => {
    const res = await fetch(`${API_BASE_URL}/zones`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: number, data: Partial<Zone>): Promise<Zone> => {
    const res = await fetch(`${API_BASE_URL}/zones/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/zones/${id}`, { method: 'DELETE' });
  },
};

// Users API
export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const res = await fetch(`${API_BASE_URL}/users`);
    return res.json();
  },
  getOne: async (id: number): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`);
    return res.json();
  },
  create: async (data: Partial<User>): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  update: async (id: number, data: Partial<User>): Promise<User> => {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  delete: async (id: number): Promise<void> => {
    await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
  },
};

