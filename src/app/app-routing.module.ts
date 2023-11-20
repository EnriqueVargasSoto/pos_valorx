import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayouts_ROUTES } from './routes/common-layouts.routes';
import { FullLayouts_ROUTES } from './routes/full-layouts.routes';
import { CommonLayoutComponent } from './layouts/common-layout/common-layout.component';
import { FullLayoutComponent } from './layouts/full-layout/full-layout.component';

const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: CommonLayouts_ROUTES
  },
  {
    path: '',
    component: FullLayoutComponent,
    children: FullLayouts_ROUTES
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
