import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { defineCustomElements } from '@ionic/core/loader';
import { AppModule } from './app/app.module';

defineCustomElements(window);

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));