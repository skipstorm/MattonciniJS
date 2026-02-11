import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TemplateService } from '../services/template.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  private router = inject(Router);
  private templateService = inject(TemplateService);

  templates = this.templateService.getAllTemplates();
  lastOpened = this.templateService.getLastOpenedTemplate();

  openTemplate(template: any) {
    this.templateService.loadTemplate(template);
    this.router.navigate(['/editor', template.id]);
  }

  continueLast() {
    if (this.lastOpened) {
      this.openTemplate(this.lastOpened);
    }
  }

  newBlankTemplate() {
    const blank: any = {
      id: 'blank-' + Date.now(),
      name: 'Nuovo template',
      previewImage: '',
      settings: { background: '#ffffff' },
      body: []
    };
    this.openTemplate(blank);
  }
}