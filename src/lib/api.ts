/**
 * Mock API service layer.
 *
 * This file simulates the REST endpoints described in the assignment
 * (Express + MongoDB + JWT + cookies). All data is persisted to
 * localStorage so CRUD, auth, and bookings work end-to-end in the browser.
 *
 * To swap in a real backend later, replace each function body with a
 * `fetch("/api/...", { credentials: "include" })` call and remove the
 * localStorage helpers. The function signatures and return shapes match
 * what an Express controller would return.
 */
import type { AuthSession, Booking, Hotel, Room, User } from "./types";
import { seedHotels, seedRooms, seedUsers } from "./seed";

const KEYS = {
  hotels: "sh_hotels",
  rooms: "sh_rooms",
  users: "sh_users",
  bookings: "sh_bookings",
  session: "sh_session",
} as const;

function isBrowser() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

function ensureSeed() {
  if (!isBrowser()) return;
  if (!localStorage.getItem(KEYS.hotels)) write(KEYS.hotels, seedHotels);
  if (!localStorage.getItem(KEYS.rooms)) write(KEYS.rooms, seedRooms);
  if (!localStorage.getItem(KEYS.users)) write(KEYS.users, seedUsers);
  if (!localStorage.getItem(KEYS.bookings)) write(KEYS.bookings, []);
}

function delay(ms = 250) {
  return new Promise((r) => setTimeout(r, ms));
}

function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
}

/* ---------- Auth (JWT-style mock) ---------- */

function makeToken(userId: string, role: string) {
  // mock JWT payload — real backend would sign this
  const payload = { sub: userId, role, iat: Date.now() };
  return `mock.${btoa(JSON.stringify(payload))}.signature`;
}

export const authApi = {
  async signup(input: { username: string; email: string; password: string }): Promise<AuthSession> {
    ensureSeed();
    await delay();
    const users = read<User[]>(KEYS.users, []);
    if (users.some((u) => u.email === input.email))
      throw new Error("An account with this email already exists.");
    const newUser: User = {
      id: uid("u"),
      username: input.username,
      email: input.email,
      password: input.password,
      role: "user",
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    write(KEYS.users, users);
    const { password, ...safe } = newUser;
    const session: AuthSession = { token: makeToken(newUser.id, newUser.role), user: safe };
    write(KEYS.session, session);
    return session;
  },

  async login(input: { email: string; password: string }): Promise<AuthSession> {
    ensureSeed();
    await delay();
    const users = read<User[]>(KEYS.users, []);
    const user = users.find((u) => u.email === input.email && u.password === input.password);
    if (!user) throw new Error("Invalid email or password.");
    const { password, ...safe } = user;
    const session: AuthSession = { token: makeToken(user.id, user.role), user: safe };
    write(KEYS.session, session);
    return session;
  },

  logout() {
    if (!isBrowser()) return;
    localStorage.removeItem(KEYS.session);
  },

  current(): AuthSession | null {
    return read<AuthSession | null>(KEYS.session, null);
  },
};

/* ---------- Hotels ---------- */

export interface HotelFilters {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export const hotelsApi = {
  async list(filters: HotelFilters = {}): Promise<Hotel[]> {
    ensureSeed();
    await delay(150);
    let hotels = read<Hotel[]>(KEYS.hotels, []);
    if (filters.city)
      hotels = hotels.filter((h) => h.city.toLowerCase().includes(filters.city!.toLowerCase()));
    if (filters.minPrice != null) hotels = hotels.filter((h) => h.cheapestPrice >= filters.minPrice!);
    if (filters.maxPrice != null) hotels = hotels.filter((h) => h.cheapestPrice <= filters.maxPrice!);
    return hotels;
  },

  async featured(): Promise<Hotel[]> {
    ensureSeed();
    await delay(120);
    return read<Hotel[]>(KEYS.hotels, []).filter((h) => h.featured);
  },

  async byId(id: string): Promise<Hotel | null> {
    ensureSeed();
    await delay(100);
    return read<Hotel[]>(KEYS.hotels, []).find((h) => h.id === id) ?? null;
  },

  async create(data: Omit<Hotel, "id">): Promise<Hotel> {
    ensureSeed();
    await delay();
    const hotels = read<Hotel[]>(KEYS.hotels, []);
    const hotel: Hotel = { ...data, id: uid("h") };
    hotels.push(hotel);
    write(KEYS.hotels, hotels);
    return hotel;
  },

  async update(id: string, patch: Partial<Hotel>): Promise<Hotel> {
    ensureSeed();
    await delay();
    const hotels = read<Hotel[]>(KEYS.hotels, []);
    const idx = hotels.findIndex((h) => h.id === id);
    if (idx === -1) throw new Error("Hotel not found");
    hotels[idx] = { ...hotels[idx], ...patch };
    write(KEYS.hotels, hotels);
    return hotels[idx];
  },

  async remove(id: string): Promise<void> {
    ensureSeed();
    await delay();
    const hotels = read<Hotel[]>(KEYS.hotels, []).filter((h) => h.id !== id);
    write(KEYS.hotels, hotels);
  },
};

/* ---------- Rooms ---------- */

export const roomsApi = {
  async list(): Promise<Room[]> {
    ensureSeed();
    await delay(100);
    return read<Room[]>(KEYS.rooms, []);
  },

  async byHotel(hotelId: string): Promise<Room[]> {
    ensureSeed();
    await delay(100);
    return read<Room[]>(KEYS.rooms, []).filter((r) => r.hotelId === hotelId);
  },

  async create(data: Omit<Room, "id">): Promise<Room> {
    ensureSeed();
    await delay();
    const rooms = read<Room[]>(KEYS.rooms, []);
    const room: Room = { ...data, id: uid("r") };
    rooms.push(room);
    write(KEYS.rooms, rooms);
    // Also link to hotel.rooms
    const hotels = read<Hotel[]>(KEYS.hotels, []);
    const hi = hotels.findIndex((h) => h.id === data.hotelId);
    if (hi !== -1) {
      hotels[hi].rooms = [...hotels[hi].rooms, room.id];
      write(KEYS.hotels, hotels);
    }
    return room;
  },

  async remove(id: string): Promise<void> {
    ensureSeed();
    await delay();
    const rooms = read<Room[]>(KEYS.rooms, []);
    const target = rooms.find((r) => r.id === id);
    write(KEYS.rooms, rooms.filter((r) => r.id !== id));
    if (target) {
      const hotels = read<Hotel[]>(KEYS.hotels, []);
      const hi = hotels.findIndex((h) => h.id === target.hotelId);
      if (hi !== -1) {
        hotels[hi].rooms = hotels[hi].rooms.filter((rid) => rid !== id);
        write(KEYS.hotels, hotels);
      }
    }
  },

  async markUnavailable(roomId: string, roomNumber: number, dates: string[]) {
    ensureSeed();
    const rooms = read<Room[]>(KEYS.rooms, []);
    const ri = rooms.findIndex((r) => r.id === roomId);
    if (ri === -1) return;
    const ni = rooms[ri].roomNumbers.findIndex((n) => n.number === roomNumber);
    if (ni === -1) return;
    rooms[ri].roomNumbers[ni].unavailableDates = [
      ...rooms[ri].roomNumbers[ni].unavailableDates,
      ...dates,
    ];
    write(KEYS.rooms, rooms);
  },
};

/* ---------- Users (admin) ---------- */

export const usersApi = {
  async list(): Promise<User[]> {
    ensureSeed();
    await delay(100);
    return read<User[]>(KEYS.users, []);
  },
  async create(data: Omit<User, "id" | "createdAt">): Promise<User> {
    ensureSeed();
    await delay();
    const users = read<User[]>(KEYS.users, []);
    if (users.some((u) => u.email === data.email))
      throw new Error("Email already in use");
    const user: User = { ...data, id: uid("u"), createdAt: new Date().toISOString() };
    users.push(user);
    write(KEYS.users, users);
    return user;
  },
  async remove(id: string): Promise<void> {
    ensureSeed();
    await delay();
    const users = read<User[]>(KEYS.users, []).filter((u) => u.id !== id);
    write(KEYS.users, users);
  },
};

/* ---------- Bookings ---------- */

export const bookingsApi = {
  async list(): Promise<Booking[]> {
    ensureSeed();
    await delay(100);
    return read<Booking[]>(KEYS.bookings, []);
  },
  async byUser(userId: string): Promise<Booking[]> {
    ensureSeed();
    await delay(100);
    return read<Booking[]>(KEYS.bookings, []).filter((b) => b.userId === userId);
  },
  async create(data: Omit<Booking, "id" | "createdAt">): Promise<Booking> {
    ensureSeed();
    await delay();
    const bookings = read<Booking[]>(KEYS.bookings, []);
    const booking: Booking = { ...data, id: uid("b"), createdAt: new Date().toISOString() };
    bookings.push(booking);
    write(KEYS.bookings, bookings);
    return booking;
  },
};

export function getDatesInRange(start: string, end: string): string[] {
  const out: string[] = [];
  const d = new Date(start);
  const last = new Date(end);
  while (d <= last) {
    out.push(d.toISOString().slice(0, 10));
    d.setDate(d.getDate() + 1);
  }
  return out;
}