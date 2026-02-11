// selection.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SelectionService {
  selectedItem = signal<any | null>(null);

  select(item: any) {
    this.selectedItem.set(item);
  }

  clear() {
    this.selectedItem.set(null);
  }
}