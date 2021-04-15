import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

/**
 * This is a small form that takes the user's username and password
 * and passes it to an API call to the database. If the login is
 * successful, they willbe redirected to the MovieCardComponent.
 */
@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss']
})
export class UserLoginFormComponent implements OnInit {

  @Input() Username = '';
  @Input() Password = '';

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  ngOnInit(): void {
  }

  loginUser(): void {
    this.fetchApiData.userLogin(this.Username, this.Password).subscribe((response) => {
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', response.user.username);
      this.dialogRef.close();
      this.snackBar.open('Logged in successfully', 'OK', {
        duration: 2000
      });
      this.router.navigate(['movies']);
    }, (response) => {
      this.snackBar.open(response, 'OK', {
        duration: 2000
      });
    });
  }
}
