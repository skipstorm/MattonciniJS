import { Component } from "@angular/core";
import { Configurable } from "../models/configurable";

@Component({
  selector: 'app-two-columns-layout',
  standalone: true,
  template: `
    <div class="two-columns" [style.gap.px]="gap">
      <div class="column"><ng-content select="[slot='1']"></ng-content></div>
      <div class="column"><ng-content select="[slot='2']"></ng-content></div>
    </div>
  `
})
export class TwoColumnsLayoutComponent extends Configurable {
  @Configurable.FormField({ type: 'number', label: 'Gap (px)', defaultValue: 24 })
  gap = 24;

  @Configurable.FormField({ type: 'select', label: 'Proporzioni', options: [
    {label: '50/50', value: '1fr 1fr'},
    {label: '60/40', value: '3fr 2fr'}
  ]})
  ratio = '1fr 1fr';

  override type = '2_columns';
}