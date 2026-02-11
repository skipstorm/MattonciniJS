import { Component } from "@angular/core";
import { Configurable } from "../models/configurable";
import { CommonModule } from "@angular/common";

@Component({ 
  selector: 'app-heading', 
  imports: [CommonModule],
  template: `
    <ng-container [ngSwitch]="level">
      <h1 *ngSwitchCase="1" [style.color]="color">{{text}}</h1>
      <h2 *ngSwitchCase="2" [style.color]="color">{{text}}</h2>
      <h3 *ngSwitchCase="3" [style.color]="color">{{text}}</h3>
      <h4 *ngSwitchCase="4" [style.color]="color">{{text}}</h4>
      <h5 *ngSwitchCase="5" [style.color]="color">{{text}}</h5>
      <h6 *ngSwitchCase="6" [style.color]="color">{{text}}</h6>
      <h1 *ngSwitchDefault [style.color]="color">{{text}}</h1>
    </ng-container>
  `})
export class HeadingComponent extends Configurable {
  @Configurable.FormField({ type: 'text', label: 'Testo' })
  text = 'Titolo';

  @Configurable.FormField({ type: 'select', label: 'Livello', options: [
    {label: 'H1', value: 1}, {label: 'H2', value: 2}, {label: 'H3', value: 3}
  ]})
  level = 1;

  @Configurable.FormField({ type: 'color', label: 'Colore' })
  color = '#000000';

  override type = 'heading';
}