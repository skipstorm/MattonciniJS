import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuilderService } from '../services/builder.service';
import { SelectionService } from '../services/selection.service';
import { ComponentRegistryService } from '../services/component-registry.service';
import { FullLayoutComponent } from '../layouts/full-layout.component';
// importa tutti gli altri layout e componenti...

@Component({
  selector: 'app-page-renderer',
  standalone: true,
  imports: [CommonModule, CdkDrag, CdkDropList],
  template: `
    <div class="page-canvas" [style.background]="builder.pageSettings().background">
      @for (section of builder.sections(); track section.id; let i = $index) {
        <div class="section-wrapper" (click)="selectSection(section, $event)">
          <ng-container *ngComponentOutlet="getLayoutComponent(section.layout); inputs: { section }">
          </ng-container>

          <!-- Pulsante aggiungi componente in ogni slot -->
          @for (slot of section.components; track slot; let slotIdx = $index) {
            <div class="slot" cdkDropList
                 [cdkDropListData]="{ sectionIdx: i, slotIdx }"
                 (cdkDropListDropped)="drop($event)">
              @for (comp of slot; track comp.id; let cIdx = $index) {
                <div class="component" cdkDrag
                     [cdkDragData]="{ sectionIdx: i, slotIdx, compIdx: cIdx }"
                     (click)="selectComponent(comp, $event)">
                  <ng-container *ngComponentOutlet="getComponent(comp.type) ?? null"></ng-container>
                  <button class="remove-btn" (click)="removeComponent(i, slotIdx, cIdx)">×</button>
                </div>
              }
              <button class="add-btn" (click)="openAddComponentModal(i, slotIdx)">+ Aggiungi</button>
            </div>
          }
        </div>
      }

      <button class="add-section-btn" (click)="openAddLayoutModal()">+ Aggiungi sezione</button>
    </div>
  `,
  styles: [`
    .page-canvas { min-height: 100vh; padding: 20px; position: relative; }
    .section-wrapper { margin-bottom: 32px; border: 1px dashed #aaa; padding: 16px; position: relative; }
    .slot { min-height: 80px; padding: 8px; border: 1px solid #ddd; margin: 8px 0; background: #fafafa; }
    .component { position: relative; border: 1px solid transparent; padding: 8px; margin: 4px 0; background: white; }
    .component:hover, .component.selected { border-color: #3b82f6; }
    .add-btn, .add-section-btn { background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
    .remove-btn { position: absolute; top: 4px; right: 4px; background: red; color: white; border: none; border-radius: 50%; width: 20px; height: 20px; line-height: 20px; cursor: pointer; }
  `]
})
export class PageRendererComponent {
  builder = inject(BuilderService);
  selection = inject(SelectionService);
  registry = inject(ComponentRegistryService);

  sections = this.builder.sections;

  getLayoutComponent(type: string) {
    return this.registry.get(type + '-layout')?.component || FullLayoutComponent; // fallback
  }

  getComponent(type: string) {
    return this.registry.get(type)?.component;
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

  openAddComponentModal(sectionIdx: number, slotIdx: number) {
    // Qui apri un modal/popover con lista componenti dal registry
    // Per semplicità: per ora simula aggiunta di un text
    this.builder.addComponent(sectionIdx, slotIdx, { type: 'text', props: {} });
  }

  openAddLayoutModal() {
    // simile: modal con lista layout
    this.builder.addSection({ layout: 'full', props: {}, components: [[]] });
  }
}