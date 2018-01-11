import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import './ckeditor.loader';
import 'ckeditor';
import { IMyDpOptions } from 'mydatepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'lodash';
import { CookieService } from 'ngx-cookie';

import { RegEx } from 'app/pages/regular-expressions';
import { MerchandiseService, ProductsService, VendorsService } from 'app/services';
import { ProductsDeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
    selector: 'app-add-product',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

    addProductForm: FormGroup;
    config = {
        uiColor: '#F0F3F4',
        height: '200',
        toolbarCanCollapse: true
    };
    productId: any;
    products: any;
    productInfo: any;
    showLoader = false;
    deleteLoader = false;
    categories = [];
    vendors: any;
    categoriesDropdownSettings = {
        singleSelection: false,
        text: "Select Categories",
        selectAllText: 'Select All',
        unSelectAllText: 'UnSelect All',
        enableSearchFilter: true,
        classes: 'col-8 no_padding'
    };
    currencyOptions = ['₹ (INR)', '$ (US)'];
    statusOptions = ['Active', 'Inactive', 'Banned', 'Out of stock'];
    bigLoader = true;
    productImageName;
    public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'dd/mm/yyyy',
        editableDateField: false,
        openSelectorOnInputClick: true
    };
    bankId: any;
    vendorId: any;
    specifications: any = [];
    approvalStatus = ['Pending', 'Approved', 'Rejected'];
    userRole: any;

    constructor(
        private cookieService: CookieService,
        private modalService: NgbModal,
        public toastr: ToastsManager,
        private _location: Location,
        private fb: FormBuilder,
        private productsService: ProductsService,
        private merchandiseService: MerchandiseService,
        private vendorsService: VendorsService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.route.params.subscribe((params) => {
            this.productId = params['productId'];
        });
        let userRoles = this.cookieService.get('userRoles');
        if (userRoles.indexOf('SuperAdmin') > -1) {
            this.userRole = 'Admin';
        } else {
            this.userRole = 'Operations';
        }
    }

    ngOnInit() {
        this.createForm();
        this.getAllVendors();
        this.getAllCategories();
        this.bigLoader = false;
        if (this.productId) {
            this.getProductInfoForEdit(this.productId);
        }
    }

    createForm() {
        this.addProductForm = this.fb.group({
            'Id': [''],
            'ModelNumber': [''],
            'Gtin': [''],
            'Sku': [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            'ParentProductCode': [
                '',
                Validators.compose([
                    Validators.required
                ])
            ],
            'Name': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(100)
                ])
            ],
            'ShortDescription': [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(1),
                    Validators.maxLength(1000)
                ])
            ],
            'FullDescription': [
                '',
                Validators.compose([
                    Validators.minLength(1),
                    Validators.maxLength(5000)
                ])
            ],
            'specifications': this.fb.array([this.createControl()]),
            'Status': [
                '',
                Validators.required
            ],
            'CurrencyId': [''],
            'NetPrice': [
                '',
                Validators.required
            ],
            'NetShippingPrice': [
                '',
                Validators.required
            ],
            'Mrp': [
                '',
                Validators.required
            ],
            'netTaxes': [''],
            'netTaxes2': [''],
            'CategoryId': [
                [],
                Validators.required
            ],
            'SellerId': [
                '',
                Validators.required
            ],
            'pictureName': [''],
            'pictureAlt': [''],
            'pictureTitle': [''],
            'pictureDisplayorder': [''],
            'Brand': [''],
            'Colour': [''],
            'Size': [''],
            'Comments': [''],
            'ManufacturerPartNumber': [''],
            'approvalStatus': ['Pending']
        });
    }

    appendMore() {
        this.specifications = this.addProductForm.get('specifications') as FormArray;
        this.specifications.push(this.createControl());
    }

    removeStructure(index) {
        const arrayControl = <FormArray>this.addProductForm.controls['specifications'];
        arrayControl.removeAt(index);
    }

    get specificationsFunction(): FormGroup {
        return this.addProductForm.get('specifications') as FormGroup;
    }

    createControl() {
        return this.fb.group({
            key: ['', Validators.required],
            value: ['', Validators.required]
        });
    }

    validatenumber(e) {
        if (!RegEx.Numbers.test(`${e.key}`) && `${e.key}`.length === 1) {
            e.preventDefault();
        }
    }

    getAllVendors() {
        this.vendors = this.vendorsService.getVendors();
    }

    getProductInfoForEdit(productId) {
        if (this.productId) {
            this.productsService.getOpsProductById(productId, this.userRole)
                .then((res) => {
                    console.log("res ", res);
                    this.products = res.Data[0];
                    this.productInfo = this.products;
                    console.log("this.productInfo ", this.productInfo);
                    this.addProductForm.controls['Id'].setValue(this.productInfo.Id);
                    this.addProductForm.controls['Name'].setValue(this.productInfo.Name);
                    this.addProductForm.controls['ShortDescription'].setValue(this.productInfo.ShortDescription);
                    this.addProductForm.controls['FullDescription'].setValue(this.productInfo.FullDescription);
                    this.addProductForm.controls['Sku'].setValue(this.productInfo.Sku);
                    this.addProductForm.controls['Status'].setValue(this.productInfo.Status);
                    this.addProductForm.controls['CurrencyId'].setValue(this.productInfo.CurrencyId);
                    this.addProductForm.controls['NetPrice'].setValue(this.productInfo.NetPrice);
                    this.addProductForm.controls['NetShippingPrice'].setValue(this.productInfo.NetShippingPrice);
                    this.addProductForm.controls['Mrp'].setValue(this.productInfo.Mrp);
                    this.addProductForm.controls['SellerId'].setValue(this.productInfo.SellerId);
                    this.addProductForm.controls['ParentProductCode'].setValue(this.productInfo.ParentProductCode);
                    this.addProductForm.controls['ModelNumber'].setValue(this.productInfo.ModelNumber);
                    this.addProductForm.controls['Brand'].setValue(this.productInfo.Brand);
                    this.addProductForm.controls['Colour'].setValue(this.productInfo.Colour);
                    this.addProductForm.controls['Size'].setValue(this.productInfo.Size);
                    this.addProductForm.controls['ImageNumber'].setValue(this.productInfo.ImageNumber);
                    this.addProductForm.controls['Gtin'].setValue(this.productInfo.Gtin);
                    this.addProductForm.controls['Comments'].setValue(this.productInfo.Comments);
                    this.addProductForm.controls['ManufacturerPartNumber'].setValue(this.productInfo.ManufacturerPartNumber);
                    // let selectedcat = this.categories.map((category) => {
                    //     if (category.Name == this.productInfo.CategoryId) {
                    //         return category;
                    //     }
                    // })
                    // this.addProductForm.controls['CategoryId'].setValue([selectedcat]);

                }).catch((error) => {
                    console.log("error ", error);
                })
        }
    }

    addProduct(addProductForm) {
        this.showLoader = true;
        console.log("addProductForm ", addProductForm);

        if (addProductForm.id) {
        }

        this.toastr.success('Sucessfully Done!', 'Sucess!');
        this.showLoader = false;
        this.goBack();
    }

    getAllCategories() {
        this.merchandiseService.getCategoriesByLevel(3).
            then((categories) => {
                this.categories = categories.Data;
                this.categories = this.categories.map((category) => {
                    category.id = category.Id;
                    category.itemName = category.Name;
                    return category;
                })
            }).catch((error) => {
                console.log("error ", error);
            });
    }

    uploadProductImage(addProductForm) {
        console.log("addProductForm ", addProductForm);
    }

    productImageSelected(image) {
        if (image.target.files.length > 0) {
            this.productImageName = image.target.files[0].name;
        } else {
            this.productImageName = '';
        }
    }

    goBack() {
        this._location.back();
    }

    resetForm() {
        this.createForm();
    }

}
