import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
declare let $: any;

import { IMyDpOptions } from 'mydatepicker';

import { ProductsService, OrdersService, JsonToExcelService, VendorsService } from 'app/services';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  searchProductForm: FormGroup;
  bigLoader = true;
  orders: any;
  orderStatus = [
    {
      id: 'Fresh',
      itemName: 'Fresh'
    },
    {
      id: 'Processed',
      itemName: 'Processed'
    },
    {
      id: 'Shipped',
      itemName: 'Shipped'
    },
    {
      id: 'Delivered',
      itemName: 'Delivered'
    },
    {
      id: 'Cancelled',
      itemName: 'Cancelled'
    },
  ];
  orderStatusDropdownSettings = {
    singleSelection: false,
    text: "Select...",
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    enableSearchFilter: true,
    classes: 'col-8 no_padding'
  };
  searchLoader = false;
  programName = ['RBI', 'SBI', 'TOI'];
  public myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true
  };
  vendorsList: any;

  constructor(
      private vendorsService: VendorsService,
      private jsonToExcelService: JsonToExcelService,
    private fb: FormBuilder,
    private productsService: ProductsService,
    private ordersService: OrdersService,
    private router: Router,
    private route: ActivatedRoute) {
  }

  ngOnInit() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.searchForm();
    this.getAllVendors();
    this.getAllOrders();
    this.bigLoader = false;
  }

  getAllVendors() {
      this.vendorsService.getVendors().
          then((vendors) => {
              this.vendorsList = vendors.Data;
              this.vendorsList = this.vendorsList.map((item) => {
                  item.id = item.SellerId;
                  item.itemName = `${item.FirstName} ${item.LastName}`;
                  return item;
              });
          }).catch((error) => {
              console.log("error", error);
          })
  }

  // For Creating Add Category Form
  searchForm() {
    this.searchProductForm = this.fb.group({
      'e.programName': [''],
      'e.sellerId': [[]],
      'e.orderFromDate': [''],
      'e.orderTillDate': [''],
      'e.status': [[]],
      'e.purchaseOrderNumber': [''],
      // rtoCheck: ['']
    });
  }

  getAllOrders() {
      this.bigLoader = true;
      this.ordersService.getOrdersByPONumber().
        then((orders) => {
            // this.orders = orders.Data;
            console.log("orders ", orders);
            this.bigLoader = false;
        }).catch((error) => {
            console.log("error ", error);
        })
    this.orders = this.ordersService.getOrders();
  }

  exportOrders() {
      this.jsonToExcelService.exportAsExcelFile(this.orders, 'orders');
  }

  searchProduct(searchOrdersForm) {
      this.searchLoader = true;
    if (searchOrdersForm['e.orderFromDate']) {
        searchOrdersForm['e.orderFromDate'] = new Date(`
            ${searchOrdersForm['e.orderFromDate'].date.month}/
            ${searchOrdersForm['e.orderFromDate'].date.day}/
            ${searchOrdersForm['e.orderFromDate'].date.year}
            `).toISOString();
    }

    if (searchOrdersForm['e.orderTillDate']) {
        searchOrdersForm['e.orderTillDate'] = new Date(`
        ${searchOrdersForm['e.orderTillDate'].date.month}/
        ${searchOrdersForm['e.orderTillDate'].date.day}/
        ${searchOrdersForm['e.orderTillDate'].date.year}
        `).toISOString();
    }
    let status = [];
    if (searchOrdersForm['e.status'].length > 0) {
        _.forEach(searchOrdersForm['e.status'], (item) => {
            status.push(item.itemName);
        });
        searchOrdersForm['e.status'] = status;
    }

    searchOrdersForm = JSON.stringify(searchOrdersForm);
    searchOrdersForm = searchOrdersForm.replace(/{|}|"/g,'', '');
    searchOrdersForm = searchOrdersForm.replace(':', '=');

    console.log('searchOrdersForm', searchOrdersForm);
    this.ordersService.getOrdersByPONumber(null, searchOrdersForm).
        then((orders) => {
            // this.orders = orders.Data;
            console.log("orders ", orders);
            this.bigLoader = false;
            this.searchLoader = false;
        }).catch((error) => {
            console.log("error ", error);
        })
  }

  resetForm() {
    this.searchForm();
  }

}
