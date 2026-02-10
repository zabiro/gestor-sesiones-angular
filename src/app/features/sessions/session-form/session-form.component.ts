import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { SessionService } from '@core/services/session.service';
import { SESSION_CATEGORIES, SESSION_STATES } from '@core/models/session.model';
import { StateLabelPipe } from '@shared/pipes/state-label.pipe';

@Component({
  selector: 'app-session-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatDividerModule,
    StateLabelPipe
  ],
  templateUrl: './session-form.component.html',
  styleUrl: './session-form.component.scss'
})
export class SessionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly snackBar = inject(MatSnackBar);

  isEdit = false;
  sessionId: string | null = null;

  readonly categories = SESSION_CATEGORIES;
  filteredCategories = [...SESSION_CATEGORIES];
  readonly states = SESSION_STATES;

  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    category: ['', Validators.required],
    city: ['', Validators.required],
    date: [null as Date | null, Validators.required],
    time: ['10:00', Validators.required],
    state: ['draft', Validators.required],
    image: ['']
  });

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('id');

    if (this.sessionId) {
      this.isEdit = true;
      const session = this.sessionService.getSessionById(this.sessionId);

      if (session) {
        const dateObj = new Date(session.date);
        const hours = String(dateObj.getHours()).padStart(2, '0');
        const minutes = String(dateObj.getMinutes()).padStart(2, '0');

        this.form.patchValue({
          title: session.title,
          description: session.description,
          category: session.category,
          city: session.city,
          date: dateObj,
          time: `${hours}:${minutes}`,
          state: session.state,
          image: session.image
        });
      } else {
        this.snackBar.open('Sesión no encontrada', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/admin']);
      }
    }
  }

  filterCategories(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredCategories = this.categories.filter(c =>
      c.toLowerCase().includes(filterValue)
    );
  }

  get imagePreview(): string {
    return this.form.get('image')?.value || '';
  }

  get pageTitle(): string {
    return this.isEdit ? 'Editar Sesión' : 'Crear Nueva Sesión';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.getRawValue();
    const date = new Date(formValue.date);
    const [hours, minutes] = (formValue.time as string).split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);

    const sessionData = {
      title: formValue.title as string,
      description: formValue.description as string,
      category: formValue.category as string,
      city: formValue.city as string,
      date: date.toISOString(),
      state: formValue.state as 'draft' | 'blocked' | 'hidden',
      image: formValue.image as string
    };

    if (this.isEdit && this.sessionId) {
      this.sessionService.updateSession({ ...sessionData, id: this.sessionId });
      this.snackBar.open('Sesión actualizada correctamente', 'Cerrar', { duration: 3000 });
    } else {
      this.sessionService.createSession(sessionData);
      this.snackBar.open('Sesión creada correctamente', 'Cerrar', { duration: 3000 });
    }

    this.router.navigate(['/admin']);
  }

  cancel(): void {
    this.router.navigate(['/admin']);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
