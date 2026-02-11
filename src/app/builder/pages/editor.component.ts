import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../services/template.service';
import { PageRendererComponent } from '../components/page-renderer.component';
import { PropertiesPanelComponent } from '../components/properties-panel.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [PageRendererComponent, PropertiesPanelComponent],
  template: `
    <div class="editor-layout">
      <app-properties-panel></app-properties-panel>
      <app-page-renderer></app-page-renderer>
    </div>
  `,
  styles: [`
    .editor-layout { display: flex; height: 100vh; }
    app-properties-panel { width: 320px; border-right: 1px solid #ddd; }
    app-page-renderer { flex: 1; overflow: auto; }
  `]
})
export class EditorComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private templateService = inject(TemplateService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('templateId');
    if (id) {
      const template = this.templateService.getTemplateById(id);
      if (template) this.templateService.loadTemplate(template);
    }
  }
}