import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EXAMPLE_TEMPLATES } from '../data/example-templates';
import { PageTemplate } from '../models/page-template';

const LAST_TEMPLATE_KEY = 'last_opened_template';

@Injectable({ providedIn: 'root' })
export class TemplateService {

  private currentTemplate = new BehaviorSubject<PageTemplate | null>(null);
  currentTemplate$ = this.currentTemplate.asObservable();

  getAllTemplates(): PageTemplate[] {
    return [...EXAMPLE_TEMPLATES];
  }

  getTemplateById(id: string): PageTemplate | undefined {
    return EXAMPLE_TEMPLATES.find(t => t.id === id);
  }

  loadTemplate(template: PageTemplate) {
    this.currentTemplate.next(structuredClone(template));
    localStorage.setItem(LAST_TEMPLATE_KEY, JSON.stringify({
      id: template.id,
      name: template.name,
      timestamp: Date.now()
    }));
  }

  getLastOpenedTemplate(): PageTemplate | null {
    const saved = localStorage.getItem(LAST_TEMPLATE_KEY);
    if (!saved) return null;

    try {
      const { id } = JSON.parse(saved);
      return this.getTemplateById(id) || null;
    } catch {
      return null;
    }
  }

  clearLastOpened() {
    localStorage.removeItem(LAST_TEMPLATE_KEY);
  }
}