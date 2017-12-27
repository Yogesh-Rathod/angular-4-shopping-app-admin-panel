import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, RequestOptions, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { environment } from './../../environments';
import { AppState } from 'app/app.service';
import { ResponseHandingService } from 'lrshared_modules/services';
// import * as CryptoJS from "crypto-js";
// import * as utf8 from 'utf8';

@Injectable()
export class MerchandiseService {

  headers = new Headers({
    'Content-Type': 'application/json',
    'Accept': 'q=0.8;application/json;q=0.9'
  });
  options = new RequestOptions({ headers: this.headers });

  // All Operations Related To Categories
  private categories: any[] = [
    {
      id: 1,
      Name: 'Computers',
      level: 1,
      parent_Name: null,
      published: true,
      display_order: 1,
      breadCrumb: 'Computers',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 2,
      parentid: 1,
      Name: 'Desktops',
      level: 2,
      parent_Name: 'Computers',
      published: false,
      display_order: 1,
      breadCrumb: 'Computers >> Desktops',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 3,
      parentid: 1,
      Name: 'Software',
      level: 2,
      parent_Name: 'Computers',
      published: true,
      display_order: 2,
      breadCrumb: 'Computers >> Software',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 4,
      Name: 'Electronics',
      parentid: '',
      level: 1,
      parent_Name: null,
      published: true,
      display_order: 2,
      breadCrumb: 'Electronics',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 5,
      Name: 'Cell phones',
      parentid: 4,
      level: 2,
      parent_Name: 'Electronics',
      published: false,
      display_order: 1,
      breadCrumb: 'Electronics >> Cell phones',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 6,
      Name: 'Others',
      parentid: 4,
      level: 2,
      parent_Name: 'Electronics',
      published: true,
      display_order: 2,
      breadCrumb: 'Electronics >> Others',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 7,
      Name: 'Apparel',
      parentid: '',
      level: 1,
      parent_Name: null,
      published: false,
      display_order: 3,
      breadCrumb: 'Apparel',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 8,
      Name: 'Clothing',
      parentid: 7,
      level: 2,
      parent_Name: 'Apparel',
      published: true,
      display_order: 1,
      breadCrumb: 'Apparel >> Clothing',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 9,
      parentid: 7,
      Name: 'Accessories',
      level: 2,
      parent_Name: 'Apparel',
      published: false,
      display_order: 2,
      breadCrumb: 'Apparel >> Accessories',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 10,
      Name: 'Caps',
      parentid: 7,
      level: 3,
      parent_Name: 'Apparel >> Accessories',
      published: false,
      display_order: 3,
      breadCrumb: 'Apparel >> Accessories >> Caps',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 11,
      Name: 'Armani Caps',
      parentid: 10,
      level: 4,
      parent_Name: 'Apparel >> Accessories >> Caps',
      published: true,
      display_order: 4,
      breadCrumb: 'Apparel >> Accessories >> Caps >> Armani Caps',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    },
    {
      id: 21,
      Name: 'Furniture',
      parentid: '',
      level: 4,
      parent_Name: 'Furniture',
      published: true,
      display_order: 4,
      breadCrumb: 'Furniture',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti cumque earum placeat officiis culpa est maiores. Optio sint earum odit cumque, blanditiis eligendi ipsum eveniet accusamus illo. Aspernatur, assumenda, at.'
    }
  ];

  constructor(
    private http: Http,
    private global: AppState,
    private responseHandingService: ResponseHandingService) {
  }

  getCategories() {
    return this.categories;
  }

  addCategory(categoryInfo) {
    this.categories.push(categoryInfo);
    return this.categories;
  }

  editCategories(categories) {
    this.categories = categories;
    return this.categories;
  }

}
