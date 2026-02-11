import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SelectionService } from '../services/selection.service';
import { BuilderService } from '../services/builder.service';
import { FormFieldDefinition } from '../models/form-field';
import { Configurable } from '../models/configurable';

@Component({
  selector: 'app-properties-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="properties-panel">
      <h3>{{ selectedItemName() }}</h3>

      @if (selectedItem(); as item) {
        @for (field of item.getFormFields(); track field.key) {
          <div class="form-group">
            <label>{{ field.label }}</label>

            @switch (field.type) {
              @case ('text') {
                <input type="text" [(ngModel)]="item[field.key]" [placeholder]="field.placeholder || ''">
              }
              @case ('textarea') {
                <textarea [(ngModel)]="item[field.key]" [placeholder]="field.placeholder || ''"></textarea>
              }
              @case ('color') {
                <input type="color" [(ngModel)]="item[field.key]">
              }
              @case ('number') {
                <input type="number" [(ngModel)]="item[field.key]" [min]="field.min" [max]="field.max" [step]="field.step">
              }
              @case ('select') {
                <select [(ngModel)]="item[field.key]">
                  @for (opt of field.options; track opt.value) {
                    <option [value]="opt.value">{{ opt.label }}</option>
                  }
                </select>
              }
              @case ('image') {
                <input type="file" accept="image/*" (change)="onImageUpload($event, item, field.key)">
                @if (item[field.key]) {
                  <img [src]="item[field.key]" alt="preview" style="max-width: 180px; margin-top: 8px;">
                }
              }
              @case ('image_url') {
                <input type="url" [(ngModel)]="item[field.key]" placeholder="https://...">
                @if (item[field.key]) {
                  <img [src]="item[field.key]" alt="preview" style="max-width: 180px; margin-top: 8px;" (error)="handleImageError($event)">
                }
              }
              @case ('toggle') {
                <input type="checkbox" [(ngModel)]="item[field.key]">
              }
              @case ('range') {
                <input type="range" [(ngModel)]="item[field.key]" [min]="field.min ?? 0" [max]="field.max ?? 100" [step]="field.step ?? 1">
                <span>{{ item[field.key] }}</span>
              }
            }
          </div>
        }
      } @else {
        <p>Nessun elemento selezionato</p>
      }
    </div>
  `,
  styles: [`
    .properties-panel { padding: 16px; border-left: 1px solid #ddd; height: 100%; overflow-y: auto; }
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 4px; font-weight: 500; }
    input, select, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    textarea { min-height: 80px; }
  `]
})
export class PropertiesPanelComponent {
  private selection = inject(SelectionService);
  private builder = inject(BuilderService);

  selectedItem = this.selection.selectedItem;
  selectedItemName = computed(() => {
    const item = this.selectedItem();
    if (!item) return 'Proprietà pagina';
    return item instanceof Configurable ? item.type : 'Pagina';
  });

  onImageUpload(event: Event, item: any, key: string) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      item[key] = reader.result as string; // data:url
      this.builder.markAsDirty(); // per undo/redo
    };
    reader.readAsDataURL(file);
  }

  handleImageError(event: Event) {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}