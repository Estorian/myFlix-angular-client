import { Component, OnInit, Input } from '@angular/core';

import  { MatDialogRef } from '@angular/material/dialog';

import { FetchApiDataService } from '../fetch-api-data.service';

import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * This form allows a new user to register for an account on
 * the database.
 */
@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { username: '', password: '', email: '', Birthday: '' }

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }


  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(() => {
      // Logic for successful user registration goes here
      this.dialogRef.close();
      this.snackBar.open("Registration Successful! Please login.", 'OK', {
        duration: 2000
      });
    }, (result) => {
      console.log(result);
      this.snackBar.open("There was an issue with your registration", 'OK', {
        duration: 2000
      });
    });
  }
}
