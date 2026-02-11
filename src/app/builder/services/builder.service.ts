// builder.service.ts
import { Injectable, signal, computed } from '@angular/core';
import { SelectionService } from '../services/selection.service';

export interface Section {
  id: string;
  layout: string;
  props: Record<string, any>;
  components: any[][];   // array di slot, ognuno è array di componenti
}

@Injectable({ providedIn: 'root' })
export class BuilderService {
  // Stato principale
  pageSettings = signal({ background: '#ffffff' });
  sections = signal<Section[]>([]);

  // Undo/redo semplice (stack di snapshot JSON)
  private history = signal<string[]>([]);
  private historyIndex = signal(-1);

  constructor(private selection: SelectionService) {
    // inizializza con template vuoto o caricato
  }

  markAsDirty() {
    const snapshot = JSON.stringify({
      pageSettings: this.pageSettings(),
      sections: this.sections()
    });
    this.history.update(h => [...h.slice(0, this.historyIndex() + 1), snapshot]);
    this.historyIndex.update(i => i + 1);
  }

  undo() {
    if (this.historyIndex() <= 0) return;
    this.historyIndex.update(i => i - 1);
    this.restoreSnapshot(this.history()[this.historyIndex()]);
  }

  redo() {
    if (this.historyIndex() >= this.history().length - 1) return;
    this.historyIndex.update(i => i + 1);
    this.restoreSnapshot(this.history()[this.historyIndex()]);
  }

  private restoreSnapshot(json: string) {
    const data = JSON.parse(json);
    this.pageSettings.set(data.pageSettings);
    this.sections.set(data.sections);
    this.selection.clear();
  }

  addSection(section: Omit<Section, 'id'>) {
    this.sections.update(sections => [...sections, { ...section, id: crypto.randomUUID() }]);
    this.markAsDirty();
  }

  addComponent(sectionIdx: number, slotIdx: number, component: any) {
    this.sections.update(sections => {
      const copy = structuredClone(sections);
      copy[sectionIdx].components[slotIdx].push({
        id: crypto.randomUUID(),
        type: component.type,
        props: { ...component.props }
      });
      return copy;
    });
    this.markAsDirty();
  }

  // Altri metodi: loadTemplate, exportJson, etc.
}