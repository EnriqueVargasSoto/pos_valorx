import { Routes } from "@angular/router";
import { HomeComponent } from "../pages/home/home.component";
import { guardGuard } from "../auth/guard.guard";

export const CommonLayouts_ROUTES: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [guardGuard]
  }
];
