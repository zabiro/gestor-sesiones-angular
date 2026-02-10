import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Session } from '../models/session.model';

const STORAGE_KEY = 'session_manager_sessions';

const SEED_SESSIONS: Session[] = [
  {
    id: 'seed-001',
    title: 'Taller de Angular 17',
    description: 'Taller avanzado sobre componentes standalone, signals y la nueva sintaxis de flujo de control en Angular 17.',
    category: 'Formación',
    city: 'Madrid',
    date: '2026-02-15T10:00:00',
    state: 'draft',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=200&fit=crop'
  },
  {
    id: 'seed-002',
    title: 'Cumbre de IA y Machine Learning',
    description: 'Explora los últimos avances en inteligencia artificial y aprendizaje automático con expertos e investigadores del sector.',
    category: 'Demo',
    city: 'Barcelona',
    date: '2026-02-20T09:00:00',
    state: 'draft',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=200&fit=crop'
  },
  {
    id: 'seed-003',
    title: 'Masterclass de Marketing Digital',
    description: 'Aprende estrategias de marketing digital de vanguardia, técnicas SEO y optimización de redes sociales para 2026.',
    category: 'Formación',
    city: 'Valencia',
    date: '2026-02-25T14:00:00',
    state: 'blocked',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop'
  },
  {
    id: 'seed-004',
    title: 'Taller de Diseño UX',
    description: 'Taller práctico sobre principios de diseño de experiencia de usuario, prototipado y metodologías de pruebas de usabilidad.',
    category: 'Formación',
    city: 'Sevilla',
    date: '2026-03-05T11:00:00',
    state: 'draft',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=200&fit=crop'
  },
  {
    id: 'seed-005',
    title: 'Reunión de Planificación Q2',
    description: 'Reunión trimestral de planificación estratégica para definir objetivos, asignar recursos y alinear equipos.',
    category: 'Reunión',
    city: 'Madrid',
    date: '2026-03-10T18:00:00',
    state: 'draft',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=200&fit=crop'
  },
  {
    id: 'seed-006',
    title: 'Demo de Producto v3.0',
    description: 'Demostración de las nuevas funcionalidades de la versión 3.0, incluyendo dashboard renovado y módulo de reportes.',
    category: 'Demo',
    city: 'Madrid',
    date: '2026-03-12T08:00:00',
    state: 'hidden',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop'
  },
  {
    id: 'seed-007',
    title: 'Reunión de Retrospectiva Sprint 14',
    description: 'Retrospectiva del sprint 14: análisis de velocidad, impedimentos encontrados y mejoras para el siguiente sprint.',
    category: 'Reunión',
    city: 'Bilbao',
    date: '2026-02-28T17:00:00',
    state: 'draft',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=200&fit=crop'
  },
  {
    id: 'seed-008',
    title: 'Formación en Metodologías Ágiles',
    description: 'Curso intensivo de Scrum, Kanban y otras metodologías ágiles aplicadas al desarrollo de software.',
    category: 'Formación',
    city: 'Barcelona',
    date: '2026-03-18T10:00:00',
    state: 'draft',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop'
  },
  {
    id: 'seed-009',
    title: 'Demo de Integración API',
    description: 'Presentación técnica de la nueva integración con APIs externas: autenticación OAuth2, webhooks y sincronización.',
    category: 'Demo',
    city: 'Madrid',
    date: '2026-03-22T09:30:00',
    state: 'draft',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=200&fit=crop'
  },
  {
    id: 'seed-010',
    title: 'Reunión General de Equipo',
    description: 'Reunión mensual del equipo completo: actualizaciones de proyecto, celebraciones y team building.',
    category: 'Reunión',
    city: 'Valencia',
    date: '2026-03-28T12:00:00',
    state: 'blocked',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop'
  }
];

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly sessionsSubject = new BehaviorSubject<Session[]>(this.loadSessions());
  readonly sessions$ = this.sessionsSubject.asObservable();

  private loadSessions(): Session[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      try {
        return JSON.parse(data) as Session[];
      } catch {
        return this.seedAndReturn();
      }
    }
    return this.seedAndReturn();
  }

  private seedAndReturn(): Session[] {
    const sessions = [...SEED_SESSIONS];
    this.saveSessions(sessions);
    return sessions;
  }

  private saveSessions(sessions: Session[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }

  getSessions(): Observable<Session[]> {
    return this.sessions$;
  }

  getSessionById(id: string): Session | undefined {
    return this.sessionsSubject.value.find(s => s.id === id);
  }

  createSession(session: Omit<Session, 'id'>): void {
    const newSession: Session = {
      ...session,
      id: this.generateId()
    };
    const sessions = [...this.sessionsSubject.value, newSession];
    this.saveSessions(sessions);
    this.sessionsSubject.next(sessions);
  }

  updateSession(updated: Session): void {
    const sessions = this.sessionsSubject.value.map(s =>
      s.id === updated.id ? { ...updated } : s
    );
    this.saveSessions(sessions);
    this.sessionsSubject.next(sessions);
  }

  deleteSession(id: string): void {
    const sessions = this.sessionsSubject.value.filter(s => s.id !== id);
    this.saveSessions(sessions);
    this.sessionsSubject.next(sessions);
  }

  private generateId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }
}
