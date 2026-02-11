import { Injectable, Type } from '@angular/core';
import { Configurable } from '../models/configurable';

export interface RegisteredItem {
  type: string;
  component: Type<any>;
  defaultProps: any;
  name: string;           // nome visualizzato
  icon?: string;
}

@Injectable({ providedIn: 'root' })
export class ComponentRegistryService {
  private items = new Map<string, RegisteredItem>();

  register(item: RegisteredItem) {
    this.items.set(item.type, item);
  }

  getAll() { return Array.from(this.items.values()); }
  get(type: string) { return this.items.get(type); }
}