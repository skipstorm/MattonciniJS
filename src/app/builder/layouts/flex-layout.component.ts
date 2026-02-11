import { Configurable } from "../models/configurable";

export class FlexLayoutComponent extends Configurable {
  @Configurable.FormField({ type: 'select', label: 'Direzione', options: [
    {label: 'Orizzontale', value: 'row'},
    {label: 'Verticale', value: 'column'}
  ]})
  direction = 'row';

  @Configurable.FormField({ type: 'toggle', label: 'Wrap' })
  wrap = false;

  @Configurable.FormField({ type: 'range', label: 'Gap', min: 0, max: 100, defaultValue: 16 })
  gap = 16;

  override type = 'flex';
}