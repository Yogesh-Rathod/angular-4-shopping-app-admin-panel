import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppTranslationModule } from '../../../app.translation.module';
import { routing } from './products.routes';
import { DataTableModule } from "angular2-datatable";
import { CKEditorModule } from 'ng2-ckeditor';
import { MyDatePickerModule } from 'mydatepicker';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DateTimePickerModule } from 'ng-pick-datetime';

import { ProductsComponent} from './products.component';
import { ProductsService } from 'app/services';
import { AddProductComponent } from "./add-product/add-product.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppTranslationModule,
    routing,
    ReactiveFormsModule,
    DataTableModule,
    CKEditorModule,
    MyDatePickerModule,
    AngularMultiSelectModule,
    DateTimePickerModule
  ],
  declarations: [
    ProductsComponent,
    AddProductComponent
  ],
  providers: [
    ProductsService
  ]
})
export class ProductsModule {}
