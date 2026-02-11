import { Component } from "@angular/core";
import { Configurable } from "../models/configurable";

@Component({ selector: 'app-button', template: `<a [href]="link" [style.backgroundColor]="color" [style.textAlign]="align">{{text}}</a>` })
export class ButtonComponent extends Configurable {
  @Configurable.FormField({ type: 'text', label: 'Testo bottone' })
  text = 'Clicca qui';

  @Configurable.FormField({ type: 'color', label: 'Colore sfondo' })
  color = '#007bff';

  @Configurable.FormField({ type: 'text', label: 'Link (URL)' })
  link = '#';

  @Configurable.FormField({ type: 'select', label: 'Allineamento', options: [
    {label: 'Sinistra', value: 'left'},
    {label: 'Centro', value: 'center'},
    {label: 'Destra', value: 'right'}
  ]})
  align = 'center';

  override type = 'button';
}