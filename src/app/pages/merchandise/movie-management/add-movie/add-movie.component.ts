import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { IMyDpOptions } from 'mydatepicker';
import { CookieService } from 'ngx-cookie';
import * as _ from 'lodash';
declare let $: any;

import { RegEx } from './../../../regular-expressions';
import { MovieManagementService } from 'app/services';
import { AppStateManagementService } from 'lrshared_modules/services';
import { MovieDeletePopupComponent } from '../delete-popup/delete-popup.component';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.scss']
})
export class AddMovieComponent implements OnInit {

  movieId: any;
  addMovieForm: FormGroup;
  bigLoader = false;
  deleteLoader = false;
  showLoader = false;
  movies: any;
  movieInfo: any;
  movieImages = [];
  myDatePickerOptions: IMyDpOptions = {
    dateFormat: 'dd/mm/yyyy',
    editableDateField: false,
    openSelectorOnInputClick: true
  };
  validationError: any;
  userInfo: any;

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private movieManagementService: MovieManagementService,
    private appStateManagementService: AppStateManagementService,
    private _location: Location,
    private toastr: ToastsManager,
    private route: ActivatedRoute,
    private router: Router,
    private cookieService: CookieService
  ) {
    this.route.params.subscribe(params =>
      this.movieId = params['movieId']
    )
    this.appStateManagementService.retrieveAppStateCK('CRM.userData').
      then((userInfo) => {
        this.userInfo = JSON.parse(userInfo);
      }).catch((error) => {
        console.log("error ", error);
        this.userInfo = {
          username: 'Unknown User'
        }
      });
  }

  ngOnInit() {
    $(document).ready(() => {
      $('[data-toggle="tooltip"]').tooltip();
    });
    this.createForm();
    if (this.movieId) {
      this.getMovieInfoForEdit();
    }
  }

  createForm() {
    this.addMovieForm = this.fb.group({
      'id': [''],
      'Title': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      'Type': [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100)
        ])
      ],
      "Language": [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ])
      ],
      "CensorRating": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'StarRating': [
        '',
        Validators.compose([
          Validators.pattern(RegEx.starRating)
        ])
      ],
      "Duration": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "Genre": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "Writer": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "Music": [''],
      "Starring": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "Director": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "ReleaseDate": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      "Synopsis": [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'TrailerUrl': [''],
      'Sequence': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'ImageUrl': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'PosterUrl': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'LandscapeUrl': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'RBCNUrl': [
        '',
        Validators.compose([
          Validators.required
        ])
      ],
      'CreatedOn': [new Date().toISOString()],
      'CreatedBy': ['']
    });
  }

  validatenumber(e) {
    if (!RegEx.Numbers.test(`${e.key}`) && `${e.key}`.length === 1) {
      e.preventDefault();
    }
  }

  addMovie(addMovieForm) {
    this.validationError = null;
    this.showLoader = true;

    let newDATA = Object.assign({}, addMovieForm);

    newDATA['ReleaseDate'] = new Date(`${addMovieForm['ReleaseDate'].date.month}/${addMovieForm['ReleaseDate'].date.day + 1}/${addMovieForm['ReleaseDate'].date.year}`).toISOString();

    if (addMovieForm.id) {
      newDATA.ModifiedOn = new Date().toISOString();
      newDATA.ModifiedBy = this.userInfo.username;
      this.movieManagementService.updateMovie(newDATA, addMovieForm.id).
        then((success) => {
          console.log("Update success ", success);
          this.toastr.success('Movie Sucessfully Updated!', 'Success!');
          this.showLoader = false;
          this._location.back();
        }).catch((error) => {
          console.log("error ", error);
          if (error.Code === 500) {
            this.toastr.error('Oops! Could not add movie.', 'Error!', { toastLife: 1500 });
          } else if (error.Code === 400) {
            this.validationError = error.FailureReasons;
          }
          this.showLoader = false;
        });
    } else {
      newDATA.CreatedBy = this.userInfo.username;
      delete newDATA['id'];
      this.movieManagementService.addMovie(newDATA).
        then((success) => {
          console.log("Add success ", success);
          this.toastr.success('Movie Sucessfully Added!', 'Success!');
          this.showLoader = false;
          this._location.back();
        }).catch((error) => {
          console.log("error ", error);
          if (error.Code === 500) {
            this.toastr.error('Oops! Could not add movie.', 'Error!', { toastLife: 1500 });
          } else if (error.Code === 400) {
            this.validationError = error.FailureReasons;
          }
          this.showLoader = false;
        });
    }
  }

  getMovieInfoForEdit() {
    this.bigLoader = true;
    this.movieManagementService.getMoviedetails(this.movieId).
      then((moviesInfo) => {
        console.log("moviesInfo ", moviesInfo);
        this.movieInfo = moviesInfo.Data;
        this.updateMovieInfo(this.movieInfo);
        this.bigLoader = false;
      }).catch((error) => {
        console.log("error ", error);
        if (error.Code === 500) {
          this.toastr.error('Oops! Something went wrong. Please try again later.', 'Error!', { toastLife: 1500 });
          this._location.back();
        }
        this.bigLoader = false;
      });
  }

  updateMovieInfo(movieInfo) {
    const releaseFullDate = new Date(movieInfo['ReleaseDate']);
    this.addMovieForm.controls['id'].setValue(movieInfo.EventId);
    this.addMovieForm.controls['Title'].setValue(movieInfo.Title);
    this.addMovieForm.controls['Type'].setValue(movieInfo.Type);
    this.addMovieForm.controls['Language'].setValue(movieInfo.Language);
    this.addMovieForm.controls['CensorRating'].setValue(movieInfo['CensorRating']);
    this.addMovieForm.controls['StarRating'].setValue(movieInfo['StarRating']);
    this.addMovieForm.controls['Duration'].setValue(movieInfo['Duration']);
    this.addMovieForm.controls['Genre'].setValue(movieInfo['Genre']);
    this.addMovieForm.controls['Writer'].setValue(movieInfo['Writer']);
    this.addMovieForm.controls['Music'].setValue(movieInfo['Music']);
    this.addMovieForm.controls['Starring'].setValue(movieInfo['Starring']);
    this.addMovieForm.controls['Director'].setValue(movieInfo['Director']);
    this.addMovieForm.controls['ReleaseDate'].setValue({
      date: {
        year: releaseFullDate.getFullYear(),
        day: releaseFullDate.getDate(),
        month: releaseFullDate.getMonth() + 1,
      }
    });
    this.addMovieForm.controls['Synopsis'].setValue(movieInfo['Synopsis']);
    this.addMovieForm.controls['TrailerUrl'].setValue(movieInfo['TrailerUrl']);
    this.addMovieForm.controls['Sequence'].setValue(movieInfo['Sequence']);
    this.addMovieForm.controls['ImageUrl'].setValue(movieInfo['ImageUrl']);
    this.addMovieForm.controls['PosterUrl'].setValue(movieInfo['PosterUrl']);
    this.addMovieForm.controls['LandscapeUrl'].setValue(movieInfo['LandscapeUrl']);
    this.addMovieForm.controls['CreatedOn'].setValue(movieInfo['CreatedOn']);
    this.addMovieForm.controls['CreatedBy'].setValue(movieInfo['CreatedBy']);
    this.checkFormValidation();
  }

  checkFormValidation() {
    for (var i in this.addMovieForm.controls) {
      this.addMovieForm.controls[i].markAsTouched();
    }
  }

}

