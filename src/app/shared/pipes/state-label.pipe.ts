import { Pipe, PipeTransform } from '@angular/core';
import { SessionState } from '@core/models/session.model';

const STATE_LABELS: Record<SessionState, string> = {
  draft: 'Borrador',
  blocked: 'Bloqueado',
  hidden: 'Oculto'
};

@Pipe({
  name: 'stateLabel',
  standalone: true
})
export class StateLabelPipe implements PipeTransform {
  transform(value: SessionState): string {
    return STATE_LABELS[value] ?? value;
  }
}
