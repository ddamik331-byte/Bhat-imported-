export interface Product {
  id: number;
  name: string;
  price: number; // in cents
  category: string;
  description: string | null;
  imageUrl: string | null;
  imageKey: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminSession {
  adminId: number;
  username: string;
}
