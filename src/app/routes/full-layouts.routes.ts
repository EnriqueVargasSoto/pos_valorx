import { Routes } from "@angular/router";
import { LoginComponent } from "../pages/login/login.component";
import { guardGuard } from "../auth/guard.guard";

export const FullLayouts_ROUTES: Routes = [
  {
    path:'login',
    component: LoginComponent,
    //canDeactivate: [guardGuard]
  }
];
