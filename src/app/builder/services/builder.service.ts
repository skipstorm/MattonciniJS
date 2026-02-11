// builder.service.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { SelectionService } from '../services/selection.service';
import { ComponentRegistryService } from './component-registry.service';
import { Configurable } from '../models/configurable';

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
  private registry = inject(ComponentRegistryService);

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
    this.sections.set(this.rehydrateSections(data.sections));
    this.selection.clear();
  }

  addSection(section: Omit<Section, 'id'>) {
    this.sections.update(sections => [...sections, { ...section, id: crypto.randomUUID() }]);
    this.markAsDirty();
  }

  addComponent(sectionIdx: number, slotIdx: number, data: any): any {
    const componentInstance = this.createComponentInstance(data.type, data);
    
    this.sections.update(sections => {
      const newSections = sections.map((section, idx) => {
        if (idx !== sectionIdx) return section;
        
        return {
          ...section,
          components: section.components.map((slot, sIdx) => {
            if (sIdx !== slotIdx) return slot;
            return [...slot, componentInstance];
          })
        };
      });
      
      return newSections;
    });
    
    this.markAsDirty();
    return componentInstance;
  }

  // METODO MANCANTE - Crea un'istanza reale del componente
  private createComponentInstance(type: string, data: any): any {
    const registryEntry = this.registry.get(type);
    
    if (registryEntry?.component) {
      try {
        // Crea un'istanza della classe registrata
        const instance = new registryEntry.component();
        
        // Applica le defaultProps prima
        if (registryEntry.defaultProps) {
          Object.assign(instance, registryEntry.defaultProps);
        }
        
        // Applica i dati passati (sovrascrivono le default)
        Object.assign(instance, data);
        
        // Assicurati che abbia un id
        if (!instance.id) {
          instance.id = crypto.randomUUID();
        }
        
        // Assicurati che abbia il tipo
        if (!instance.type) {
          instance.type = type;
        }
        
        return instance;
      } catch (error) {
        console.warn(`Errore creazione istanza per tipo ${type}:`, error);
      }
    }
    
    // Fallback: plain object con metodo getFormFields fittizio
    return { 
      ...data, 
      id: data.id || crypto.randomUUID(),
      type: type,
      getFormFields: () => []
    };
  }

  // Metodo per ricostruire le istanze dopo undo/redo (JSON.parse perde le classi)
  private rehydrateSections(sections: any[]): Section[] {
    return sections.map(section => ({
      ...section,
      components: section.components.map((slot: any[]) => 
        slot.map(comp => {
          // Se è già un'istanza valida con getFormFields, lasciala
          if (typeof comp.getFormFields === 'function') return comp;
          
          // Altrimenti ricrea l'istanza dal tipo
          return this.createComponentInstance(comp.type || 'unknown', comp);
        })
      )
    }));
  }

  // Altri metodi: loadTemplate, exportJson, etc.
}