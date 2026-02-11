import { Component, Input } from '@angular/core';
import { Configurable } from '../models/configurable';

@Component({
  selector: 'app-full-layout',
  standalone: true,
  template: `<div class="full-layout"><ng-content></ng-content></div>`
})
export class FullLayoutComponent extends Configurable {
  @Configurable.FormField({ type: 'color', label: 'Sfondo' })
  @Input() section: any; 
  background = '#ffffff';

  override type = 'full';
}