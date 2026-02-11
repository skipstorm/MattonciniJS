import { Component } from "@angular/core";
import { Configurable } from "../models/configurable";

@Component({ selector: 'app-text', standalone: true, template: `<p [style.color]="color">{{text}}</p>` })
export class TextComponent extends Configurable {
  @Configurable.FormField({ type: 'textarea', label: 'Testo' })
  text = 'Testo semplice';

  @Configurable.FormField({ type: 'color', label: 'Colore' })
  color = '#000000';

  override type = 'text';
}