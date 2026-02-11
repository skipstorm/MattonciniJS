import { FormFieldConfig, FormFieldDefinition } from './form-field';
import "reflect-metadata";

export abstract class Configurable {
  id: string = crypto.randomUUID();
  type: string = '';

  // Decoratore da usare sulle proprietà
  static FormField(config: FormFieldConfig) {
    return function (target: any, propertyKey: string) {
      Reflect.defineMetadata(`formField_${propertyKey}`, { key: propertyKey, ...config }, target);
    };
  }

  // Raccoglie automaticamente tutti i campi decorati
  getFormFields(): FormFieldDefinition[] {
    const fields: FormFieldDefinition[] = [];
    const prototype = Object.getPrototypeOf(this);

    for (const key of Object.getOwnPropertyNames(this)) {
      const meta = Reflect.getMetadata(`formField_${key}`, prototype);
      if (meta) {
        fields.push(meta);
      }
    }
    return fields.sort((a, b) => a.key.localeCompare(b.key));
  }
}