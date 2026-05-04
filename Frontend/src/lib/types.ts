export type Role = "user" | "admin";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string; // mock only — real backend hashes this
  role: Role;
  country?: string;
  city?: string;
  phone?: string;
  createdAt: string;
}

export interface Room {
  id: string;
  hotelId: string;
  title: string;
  price: number;
  maxPeople: number;
  description: string;
  roomNumbers: { number: number; unavailableDates: string[] }[];
}

export interface Hotel {
  id: string;
  name: string;
  type: string;
  city: string;
  address: string;
  distance: string;
  photos: string[];
  title: string;
  description: string;
  rating: number;
  cheapestPrice: number;
  featured: boolean;
  rooms: string[]; // room ids
  amenities: string[];
}

export interface Booking {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  roomNumbers: number[];
  dateStart: string;
  dateEnd: string;
  totalPrice: number;
  createdAt: string;
}

export interface AuthSession {
  token: string; // mock JWT
  user: Omit<User, "password">;
}