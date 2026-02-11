export interface PageTemplate {
  id: string;
  name: string;
  previewImage: string;           // URL o data:URL per l'anteprima
  settings: Record<string, any>;  // es. { background: string, width?: string, height?: string }
  body: Section[];
}

export interface Section {
  id: string;
  layout: string;                 // 'full', '2_columns', '3_columns', 'flex', ...
  props: Record<string, any>;
  components: ComponentInstance[][];
}

export interface ComponentInstance {
  id: string;
  type: string;                   // 'heading', 'text', 'button', 'qrcode', ...
  props: Record<string, any>;
}