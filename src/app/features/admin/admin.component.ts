import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { Subscription } from 'rxjs';
import { SessionService } from '@core/services/session.service';
import { Session } from '@core/models/session.model';
import { AuthService } from '@core/services/auth.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { StateLabelPipe } from '@shared/pipes/state-label.pipe';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    DatePipe,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatCardModule,
    StateLabelPipe
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit, OnDestroy {
  private readonly sessionService = inject(SessionService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);
  private subscription!: Subscription;

  sessions: Session[] = [];
  displayedColumns: string[] = ['image', 'title', 'category', 'city', 'date', 'state', 'actions'];

  get adminCity(): string {
    return this.authService.getUser()?.city ?? '';
  }

  canDelete(session: Session): boolean {
    return session.city === this.adminCity;
  }

  ngOnInit(): void {
    this.subscription = this.sessionService.getSessions().subscribe(sessions => {
      this.sessions = sessions;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  createSession(): void {
    this.router.navigate(['/session/create']);
  }

  editSession(id: string): void {
    this.router.navigate(['/session/edit', id]);
  }

  deleteSession(session: Session): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Eliminar Sesión',
        message: `¿Estás seguro de que deseas eliminar "${session.title}"? Esta acción no se puede deshacer.`
      },
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.sessionService.deleteSession(session.id);
        this.snackBar.open('Sesión eliminada correctamente', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
