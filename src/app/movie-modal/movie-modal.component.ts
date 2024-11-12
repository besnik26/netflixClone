import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SafeurlPipe } from '../pipes/safeurl.pipe';
@Component({
  selector: 'app-movie-modal',
  standalone: true,
  imports: [SafeurlPipe],
  templateUrl: './movie-modal.component.html',
  styleUrl: './movie-modal.component.css'
})
export class MovieModalComponent {
  @Input() movie: any;
  @Input() genres: string[] = [];
  @Input() cast: any[] = [];

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
