import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../../app.translation.module';
import { DataTableModule } from "angular2-datatable";
import { CKEditorModule } from 'ng2-ckeditor';
import { MerchandiseService } from 'app/services';
import { MyDatePickerModule } from 'mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';

import { routing } from './catalog-management.routes';
import { CatalogManagementComponent } from './catalog-management.component';
import { BankDetailsComponent } from './catalog-details/catalog-details.component';
import { BasicInfoComponent } from "./catalog-details/basic-info/basic-info.component";
import { ProductsInfoComponent } from './catalog-details/products-info/products-info.component';
import { VendorsInfoComponent } from './catalog-details/vendors-info/vendors-info.component';
import { CatalogManagementService, VendorsService } from 'app/services';
import { AddCatalogComponent } from './add-catalog/add-catalog.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    routing,
    ReactiveFormsModule,
    CKEditorModule,
    DataTableModule,
    MyDatePickerModule,
    AngularMultiSelectModule
  ],
  declarations: [
    CatalogManagementComponent,
    BankDetailsComponent,
    BasicInfoComponent,
    ProductsInfoComponent,
    VendorsInfoComponent,
    AddCatalogComponent
  ],
  providers: [
    CatalogManagementService,
    VendorsService
  ],
  entryComponents: [
  ]
})
export class CatalogManagementModule { }
