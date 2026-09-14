import { ManagedUser } from '../types/adminTypes';
import { INITIAL_TRUCKS } from './mockData';

const SEED_USERS: ManagedUser[] = [
  {
    id: 'usr-1',
    name: 'Nakul Venkatesh',
    email: 'nakul@collabfleet.in',
    phone: '+91 98401 23456',
    role: 'shipper',
    company: 'Apex Technologies Freight Co.',
    tripsCount: 18,
    rating: 4.95,
    status: 'verified',
    joinedDate: '2026-07-14',
    activeShipmentsOrTrucks: 2,
    location: 'Chennai'
  },
  {
    id: 'usr-2',
    name: 'Ramanathan Swamy',
    email: 'r.swamy@swamytrans.com',
    phone: '+91 98410 44821',
    role: 'fleet_operator',
    company: 'Swamy Inter-State Carriers',
    tripsCount: 84,
    rating: 4.88,
    status: 'verified',
    joinedDate: '2026-06-02',
    activeShipmentsOrTrucks: 6,
    location: 'Chennai'
  },
  {
    id: 'usr-3',
    name: 'Rajesh Kumar',
    email: 'rajesh.k@driver.collabfleet.in',
    phone: '+91 98401 55210',
    role: 'driver',
    company: 'Swamy Inter-State Carriers',
    tripsCount: 412,
    rating: 4.92,
    status: 'verified',
    joinedDate: '2026-05-19',
    activeShipmentsOrTrucks: 1,
    location: 'Chennai → Bengaluru'
  },
  {
    id: 'usr-4',
    name: 'Pooja Hegde',
    email: 'pooja@karnatakafreight.in',
    phone: '+91 98801 88412',
    role: 'fleet_operator',
    company: 'Karnataka Bulk Logistics',
    tripsCount: 120,
    rating: 4.85,
    status: 'verified',
    joinedDate: '2026-06-25',
    activeShipmentsOrTrucks: 8,
    location: 'Bengaluru'
  },
  {
    id: 'usr-5',
    name: 'Manjunath Gowda',
    email: 'manjunath.g@driver.collabfleet.in',
    phone: '+91 98450 67890',
    role: 'driver',
    company: 'Karnataka Bulk Logistics',
    tripsCount: 620,
    rating: 4.87,
    status: 'verified',
    joinedDate: '2026-04-10',
    activeShipmentsOrTrucks: 1,
    location: 'Bengaluru'
  },
  {
    id: 'usr-6',
    name: 'Anand Mahindra',
    email: 'anand.m@tatamotorssupply.com',
    phone: '+91 98200 11928',
    role: 'shipper',
    company: 'Auto Components Assemblers',
    tripsCount: 46,
    rating: 4.96,
    status: 'verified',
    joinedDate: '2026-07-01',
    activeShipmentsOrTrucks: 4,
    location: 'Pune'
  },
  {
    id: 'usr-7',
    name: 'Suresh Patel',
    email: 'suresh@gujaratlogistics.in',
    phone: '+91 98790 22345',
    role: 'fleet_operator',
    company: 'Western Corridor Carriers',
    tripsCount: 68,
    rating: 4.78,
    status: 'verified',
    joinedDate: '2026-08-05',
    activeShipmentsOrTrucks: 5,
    location: 'Ahmedabad'
  },
  {
    id: 'usr-8',
    name: 'Vikram Joshi',
    email: 'v.joshi@expresslines.in',
    phone: '+91 98210 99812',
    role: 'shipper',
    company: 'Pharma Cold Chain Solutions',
    tripsCount: 12,
    rating: 4.82,
    status: 'pending',
    joinedDate: '2026-09-02',
    activeShipmentsOrTrucks: 1,
    location: 'Hyderabad'
  }
];

export class AdminUserService {
  private static users: ManagedUser[] = AdminUserService.initUsers();

  private static initUsers(): ManagedUser[] {
    try {
      const stored = localStorage.getItem('collabfleet_admin_users');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}

    const driverUsers: ManagedUser[] = INITIAL_TRUCKS.map((t, idx) => ({
      id: `usr-drv-${idx + 10}`,
      name: t.driver.name,
      email: `${t.driver.name.toLowerCase().replace(/[^a-z]/g, '.')}@driver.collabfleet.in`,
      phone: t.driver.phone,
      role: 'driver',
      company: t.company,
      tripsCount: t.driver.tripsCompleted,
      rating: t.driver.rating,
      status: 'verified',
      joinedDate: '2026-05-10',
      activeShipmentsOrTrucks: 1,
      location: t.currentLocation.name
    }));

    const combined = [...SEED_USERS, ...driverUsers];
    try {
      localStorage.setItem('collabfleet_admin_users', JSON.stringify(combined));
    } catch {}
    return combined;
  }

  public static async getUsers(roleFilter = 'all'): Promise<ManagedUser[]> {
    if (roleFilter === 'all' || !roleFilter) return [...this.users];
    return this.users.filter(u => u.role === roleFilter);
  }

  public static async updateUserStatus(userId: string, status: 'verified' | 'pending' | 'suspended'): Promise<ManagedUser | null> {
    const user = this.users.find(u => u.id === userId);
    if (user) {
      user.status = status;
      try {
        localStorage.setItem('collabfleet_admin_users', JSON.stringify(this.users));
      } catch {}
      return { ...user };
    }
    return null;
  }
}
