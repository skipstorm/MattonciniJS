import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { BuilderService } from '../services/builder.service';
import { SelectionService } from '../services/selection.service';
import { ComponentRegistryService, RegisteredItem } from '../services/component-registry.service';
import { FullLayoutComponent } from '../layouts/full-layout.component';
import { AddItemDropdownComponent } from './add-item-dropdown/add-item-dropdown.component';

@Component({
  selector: 'app-page-renderer',
  standalone: true,
  imports: [
    CommonModule,
    CdkDrag,
    CdkDropList,
    AddItemDropdownComponent, // <-- AGGIUNGI
  ],
  template: `
    <div class="page-canvas" [style.background]="builder.pageSettings().background">
      @for (section of builder.sections(); track section.id; let i = $index) {
        <div class="section-wrapper" (click)="selectSection(section, $event)">
          <!-- Layout dinamico -->
          <ng-container
            *ngComponentOutlet="
              getLayoutComponent(section.layout);
              inputs: layoutInputs(section)
            "
          ></ng-container>

          <!-- Slot -->
          @for (slot of section.components; track $index; let slotIdx = $index) {
            <div class="slot"
                 cdkDropList
                 [cdkDropListData]="{ sectionIdx: i, slotIdx }"
                 (cdkDropListDropped)="drop($event)">
              
              @for (comp of slot; track comp.id; let cIdx = $index) {
                <div class="component"
                     cdkDrag
                     [cdkDragData]="{ sectionIdx: i, slotIdx, compIdx: cIdx }"
                     (click)="selectComponent(comp, $event)">
                  
                  <ng-container
                    *ngComponentOutlet="
                      getComponent(comp.type);
                      inputs: { component: comp }
                    "
                  ></ng-container>

                  <button class="remove-btn" (click)="removeComponent(i, slotIdx, cIdx)">×</button>
                </div>
              }

              <!-- TENDINA AGGIUNGI COMPONENTE -->
              @if (showComponentDropdown() === slotIdx) {
                <app-add-item-dropdown
                  [items]="availableComponents()"
                  (selected)="addComponent(i, slotIdx, $event)"
                />
              } @else {
                <button class="add-btn" (click)="toggleComponentDropdown(slotIdx)">
                  + Aggiungi componente
                </button>
              }
            </div>
          }
        </div>
      }

      <!-- TENDINA AGGIUNGI SEZIONE -->
      @if (showLayoutDropdown()) {
        <app-add-item-dropdown
          [items]="availableLayouts()"
          (selected)="addLayout($event)"
        />
      } @else {
        <button class="add-section-btn" (click)="toggleLayoutDropdown()">
          + Aggiungi sezione
        </button>
      }
    </div>
  `,
  styles: [`
    .page-canvas { min-height: 100vh; padding: 20px; position: relative; }
    .section-wrapper { 
      margin-bottom: 32px; 
      border: 1px dashed #aaa; 
      padding: 16px; 
      position: relative; 
    }
    .slot { 
      min-height: 80px; 
      padding: 8px; 
      border: 1px solid #ddd; 
      margin: 8px 0; 
      background: #fafafa; 
    }
    .component { 
      position: relative; 
      border: 1px solid transparent; 
      padding: 8px; 
      margin: 4px 0; 
      background: white; 
    }
    .component:hover { border-color: #3b82f6; }
    .add-btn, .add-section-btn { 
      background: #10b981; 
      color: white; 
      border: none; 
      padding: 6px 12px; 
      border-radius: 4px; 
      cursor: pointer; 
      margin-top: 8px; 
      width: 100%;
    }
    .remove-btn { 
      position: absolute; 
      top: 4px; 
      right: 4px; 
      background: red; 
      color: white; 
      border: none; 
      border-radius: 50%; 
      width: 20px; 
      height: 20px; 
      line-height: 20px; 
      cursor: pointer; 
    }
  `]
})
export class PageRendererComponent {
  builder = inject(BuilderService);
  selection = inject(SelectionService);
  registry = inject(ComponentRegistryService);

  // Stato per le tendine
  showComponentDropdown = signal<number | null>(null); // slotIdx o null
  showLayoutDropdown = signal(false);

  // Items disponibili
  availableComponents = () => this.registry.getAll().filter(i => !i.type.endsWith('-layout'));
  availableLayouts = () => this.registry.getAll().filter(i => i.type.endsWith('-layout'));

  getLayoutComponent(type: string) {
    return this.registry.get(type)?.component ?? FullLayoutComponent;
  }

  getComponent(type: string) {
    return this.registry.get(type)?.component ?? null;
  }

  layoutInputs(section: any) {
    return { section };
  }

  toggleComponentDropdown(slotIdx: number) {
    this.showComponentDropdown.set(slotIdx);
  }

  toggleLayoutDropdown() {
    this.showLayoutDropdown.set(true);
  }

  addComponent(sectionIdx: number, slotIdx: number, item: RegisteredItem) {
    const instance = this.builder.addComponent(sectionIdx, slotIdx, {
      id: 'comp-' + Date.now(),
      type: item.type,
      ...item.defaultProps
    });
    
    // Seleziona automaticamente il nuovo componente per mostrare le opzioni
    this.selection.select(instance);
    
    // Chiudi tendina
    this.showComponentDropdown.set(null);
  }

  addLayout(item: RegisteredItem) {
    const slotCount = this.getSlotCount(item.type);
    
    const section = {
      layout: item.type,
      props: { ...item.defaultProps },
      components: Array(slotCount).fill(null).map(() => [])
    };
    
    this.builder.addSection(section);
    
    // Seleziona la nuova sezione
    // this.selection.select(section); // opzionale
    
    // Chiudi tendina
    this.showLayoutDropdown.set(false);
  }

  private getSlotCount(layoutType: string): number {
    if (layoutType.includes('two') || layoutType.includes('2')) return 2;
    if (layoutType.includes('three') || layoutType.includes('3')) return 3;
    return 1;
  }

  selectSection(section: any, event: MouseEvent) {
    event.stopPropagation();
    this.selection.select(section);
  }

  selectComponent(comp: any, event: MouseEvent) {
    event.stopPropagation();
    this.selection.select(comp);
  }


  drop(event: CdkDragDrop<any>) {
    const { sectionIdx, slotIdx } = event.container.data;
    if (event.previousContainer === event.container) {
      moveItemInArray(
        this.builder.sections()[sectionIdx].components[slotIdx],
        event.previousIndex,
        event.currentIndex
      );
    } else {
      // move tra slot diversi → implementare se serve
    }
    this.builder.markAsDirty();
  }

  removeComponent(sectionIdx: number, slotIdx: number, compIdx: number) {
    this.builder.sections.update(sections => {
      const copy = structuredClone(sections);
      copy[sectionIdx].components[slotIdx].splice(compIdx, 1);
      return copy;
    });
    this.builder.markAsDirty();
  }
}