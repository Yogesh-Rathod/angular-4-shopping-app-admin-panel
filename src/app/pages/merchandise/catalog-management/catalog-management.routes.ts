import { AuthGuard } from './../../../guards/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';

import { CatalogManagementComponent } from './catalog-management.component';
import { BankDetailsComponent } from './bank-details/bank-details.component';
import { AddCatalogComponent } from './add-catalog/add-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogManagementComponent
  },
  {
    path: 'add-catalog',
    component: AddCatalogComponent
  },
  {
    path: 'bank-details/:bankId',
    component: BankDetailsComponent
  }
];

export const routing = RouterModule.forChild(routes);

