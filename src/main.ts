import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ComponentRegistryService } from './app/builder/services/component-registry.service';
import { FullLayoutComponent } from './app/builder/layouts/full-layout.component';
import { TextComponent } from './app/builder/components-ui/text.component';

function initializeRegistry(registry: ComponentRegistryService): () => void {
  return () => {
    // Layout
    registry.register({
      type: 'full-layout',
      component: FullLayoutComponent,
      defaultProps: { background: '#ffffff' },
      name: 'Layout Pieno',
      icon: '📄'
    });
    
    // Componenti
    registry.register({
      type: 'text',
      component: TextComponent,
      defaultProps: { content: 'Nuovo testo', fontSize: 16, color: '#000000' },
      name: 'Testo',
      icon: '📝'
    });
  };
}

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    {
      provide: 'APP_INITIALIZER',
      useFactory: initializeRegistry,
      deps: [ComponentRegistryService],
      multi: true
    }
  ]
})
.catch((err) => console.error(err));