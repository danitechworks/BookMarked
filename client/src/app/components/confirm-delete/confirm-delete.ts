import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

@Component({
  selector: 'app-confirm-delete',
  imports: [],
  templateUrl: './confirm-delete.html',
  styleUrl: './confirm-delete.scss'
})
export class ConfirmDelete {
  @Input() itemDescription = '';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  protected confirmDelete(): void {
    this.confirmed.emit();
  }

  protected cancelDelete(): void {
    this.cancelled.emit();
  }
}
