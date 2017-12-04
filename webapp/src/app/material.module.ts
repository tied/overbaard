import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule, MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule, MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {NgModule, Type} from '@angular/core';

// An attempt to avoid duplicating this in the imports and exports lists
const materialModules: Array<Type<any>> = [
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSidenavModule,
  MatToolbarModule,
  MatProgressSpinnerModule]

@NgModule({
  imports: materialModules,
  exports: materialModules,
})
export class MaterialModule {
}
