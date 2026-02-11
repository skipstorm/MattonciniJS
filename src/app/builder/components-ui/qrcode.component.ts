import { Component } from "@angular/core";
import { Configurable } from "../models/configurable";
import { QRCodeComponent } from 'angularx-qrcode';

@Component({ selector: 'app-qrcode', 
  imports: [QRCodeComponent],
  template: `
  <div>
    <p>{{textBefore}}</p>
    <qrcode [qrdata]="url" [width]="256"></qrcode>
    <p>{{textAfter}}</p>
  </div>
`})
export class QrCodeWrapperComponent extends Configurable {
  @Configurable.FormField({ type: 'text', label: 'Testo prima' })
  textBefore = '';

  @Configurable.FormField({ type: 'text', label: 'Testo dopo' })
  textAfter = '';

  @Configurable.FormField({ type: 'text', label: 'URL per QR Code' })
  url = 'https://example.com';

  override type = 'qrcode';
}