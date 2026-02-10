export type SessionState = 'draft' | 'blocked' | 'hidden';

export interface Session {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  date: string;
  state: SessionState;
  image: string;
}

export const SESSION_CATEGORIES: string[] = [
  'Formación',
  'Reunión',
  'Demo',
  'Tecnología',
  'Negocios',
  'Salud',
  'Educación',
  'Entretenimiento',
  'Deportes',
  'Ciencia',
  'Arte',
  'Marketing',
  'Diseño'
];

export const SESSION_STATES: SessionState[] = ['draft', 'blocked', 'hidden'];
