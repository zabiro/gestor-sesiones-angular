import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Session } from '@core/models/session.model';
import { StateLabelPipe } from '@shared/pipes/state-label.pipe';

@Component({
  selector: 'app-session-detail-dialog',
  standalone: true,
  imports: [
    DatePipe,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
    StateLabelPipe
  ],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>

    <mat-dialog-content>
      @if (data.image) {
        <img [src]="data.image"
             [alt]="data.title"
             class="session-image"
             (error)="onImageError($event)">
      }

      <p class="description">{{ data.description }}</p>

      <mat-divider></mat-divider>

      <div class="details">
        <div class="detail-row">
          <mat-icon>category</mat-icon>
          <span class="detail-label">Categoría</span>
          <span class="detail-value">{{ data.category }}</span>
        </div>

        <div class="detail-row">
          <mat-icon>location_city</mat-icon>
          <span class="detail-label">Ciudad</span>
          <span class="detail-value">{{ data.city }}</span>
        </div>

        <div class="detail-row">
          <mat-icon>schedule</mat-icon>
          <span class="detail-label">Fecha</span>
          <span class="detail-value">{{ data.date | date:'medium' }}</span>
        </div>

        <div class="detail-row">
          <mat-icon>info</mat-icon>
          <span class="detail-label">Estado</span>
          <mat-chip [class]="'state-' + data.state">
            {{ data.state | stateLabel }}
          </mat-chip>
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close color="primary">Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .session-image {
      width: 100%;
      max-height: 220px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .description {
      color: #555;
      margin-bottom: 16px;
      line-height: 1.6;
      font-size: 14px;
    }

    mat-divider {
      margin-bottom: 16px;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .detail-row {
      display: flex;
      align-items: center;
      gap: 10px;

      mat-icon {
        color: #3f51b5;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .detail-label {
        font-weight: 500;
        color: #555;
        min-width: 70px;
        font-size: 13px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .detail-value {
        color: #333;
        font-size: 14px;
      }
    }

    .state-draft {
      background-color: #e8f5e9 !important;
      color: #2e7d32 !important;
    }

    .state-blocked {
      background-color: #ffebee !important;
      color: #c62828 !important;
    }

    .state-hidden {
      background-color: #f5f5f5 !important;
      color: #616161 !important;
    }
  `]
})
export class SessionDetailDialogComponent {
  readonly data = inject<Session>(MAT_DIALOG_DATA);

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
