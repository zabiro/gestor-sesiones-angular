import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subscription } from 'rxjs';
import { SessionService } from '@core/services/session.service';
import { Session, SESSION_CATEGORIES, SESSION_STATES, SessionState } from '@core/models/session.model';
import { SessionDetailDialogComponent } from './session-detail-dialog.component';
import { StateLabelPipe } from '@shared/pipes/state-label.pipe';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FormsModule,
    FullCalendarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatTooltipModule,
    StateLabelPipe
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy {
  private readonly sessionService = inject(SessionService);
  private readonly dialog = inject(MatDialog);
  private subscription!: Subscription;

  readonly categories = SESSION_CATEGORIES;
  readonly states = SESSION_STATES;
  filteredCategories = [...SESSION_CATEGORIES];

  searchText = signal('');
  selectedCategory = signal('');
  selectedState = signal('');

  allSessions: Session[] = [];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: ''
    },
    events: [],
    eventClick: this.onEventClick.bind(this),
    height: 'auto',
    eventDisplay: 'block',
    dayMaxEvents: 3,
    firstDay: 1
  };

  ngOnInit(): void {
    this.subscription = this.sessionService.getSessions().subscribe(sessions => {
      this.allSessions = sessions;
      this.updateCalendarEvents();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onSearchChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchText.set(value);
    this.updateCalendarEvents();
  }

  onCategoryChange(value: string): void {
    this.selectedCategory.set(value);
    this.updateCalendarEvents();
  }

  filterCategories(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredCategories = this.categories.filter(c =>
      c.toLowerCase().includes(filterValue)
    );
  }

  onCategorySelected(value: string): void {
    this.selectedCategory.set(value);
    this.updateCalendarEvents();
  }

  clearCategory(): void {
    this.selectedCategory.set('');
    this.filteredCategories = [...this.categories];
    this.updateCalendarEvents();
  }

  onStateChange(value: string): void {
    this.selectedState.set(value);
    this.updateCalendarEvents();
  }

  clearFilters(): void {
    this.searchText.set('');
    this.selectedCategory.set('');
    this.selectedState.set('');
    this.updateCalendarEvents();
  }

  get hasActiveFilters(): boolean {
    return !!this.searchText() || !!this.selectedCategory() || !!this.selectedState();
  }

  private updateCalendarEvents(): void {
    const sessions = this.getFilteredSessions();
    this.calendarOptions = {
      ...this.calendarOptions,
      events: sessions.map(s => ({
        id: s.id,
        title: s.title,
        date: s.date,
        backgroundColor: this.getStateColor(s.state),
        borderColor: this.getStateColor(s.state),
        extendedProps: { session: s }
      }))
    };
  }

  private getFilteredSessions(): Session[] {
    let sessions = [...this.allSessions];
    const search = this.searchText().toLowerCase();
    const category = this.selectedCategory();
    const state = this.selectedState();

    if (search) {
      sessions = sessions.filter(s =>
        s.title.toLowerCase().includes(search) ||
        s.description.toLowerCase().includes(search) ||
        s.city.toLowerCase().includes(search)
      );
    }

    if (category) {
      sessions = sessions.filter(s => s.category === category);
    }

    if (state) {
      sessions = sessions.filter(s => s.state === state);
    }

    return sessions;
  }

  private onEventClick(info: EventClickArg): void {
    const session = info.event.extendedProps['session'] as Session;
    this.dialog.open(SessionDetailDialogComponent, {
      data: session,
      width: '500px',
      maxWidth: '95vw'
    });
  }

  private getStateColor(state: SessionState): string {
    const colors: Record<SessionState, string> = {
      draft: '#4caf50',
      blocked: '#f44336',
      hidden: '#9e9e9e'
    };
    return colors[state] ?? '#2196f3';
  }
}
