export interface User {
  email: string;
  name: string;
  role: 'admin' | 'user';
  token: string;
  city: string;
}
