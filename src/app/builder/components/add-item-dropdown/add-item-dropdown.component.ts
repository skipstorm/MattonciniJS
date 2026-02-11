import { Component, inject, output, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentRegistryService, RegisteredItem } from '../../services/component-registry.service';

@Component({
  selector: 'app-add-item-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dropdown">
      <select (change)="onSelect($event)">
        <option value="">Seleziona...</option>
        @for (item of items(); track item.type) {
          <option [value]="item.type">{{ item.name }}</option>
        }
      </select>
    </div>
  `,
  styles: [`
    .dropdown {
      margin-top: 8px;
    }
    select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
    }
  `]
})
export class AddItemDropdownComponent {
  private registry = inject(ComponentRegistryService);
  
  items = input<RegisteredItem[]>([]);
  selected = output<RegisteredItem>();
  
  onSelect(event: Event) {
    const select = event.target as HTMLSelectElement;
    const type = select.value;
    if (!type) return;
    
    const item = this.registry.get(type);
    if (item) {
      this.selected.emit(item);
      select.value = ''; // Reset
    }
  }
}