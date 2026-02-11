export interface FormFieldConfig {
  type: 'text' | 'textarea' | 'color' | 'number' | 'select' | 'image' | 'image_url' | 'toggle' | 'range';
  label: string;
  placeholder?: string;
  options?: { label: string; value: any }[];   // solo per select
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: any;
}

export interface FormFieldDefinition extends FormFieldConfig {
  key: string;   // nome della proprietà
}