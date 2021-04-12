import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/internal/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';


const apiURL = 'https://estorians-movie-api.herokuapp.com/';
@Injectable({
  providedIn: 'root'
})

export class FetchApiDataService {
  //Inject the HttpClient module to the constructor params
  //This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  //Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiURL + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  //Make the API call to login and get the JWT
  public userLogin(username: string, password: string): Observable<any> {
    return this.http.post(apiURL + 'login', {
      Username: username,
      Password: password
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  //Make the API call to get information about one director
  public getDirectorInfo(directorName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiURL + 'directors/' + directorName, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      )
  }

  // Make the API call to get information about one movie
  public getMovieInfo(movieName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiURL + 'movies/' + movieName, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      )
  }

  // Genre API call
  public getGenreInfo(genreName: string): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiURL + 'genres/' + genreName, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      )
  }

  // User profile API call
  // This API call can be used to get the list of favorite movies
  // as part of the user information
  public getUserInfo(): Observable<any> {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http.get(apiURL + 'users/' + user, {headers: new HttpHeaders(
      {
        Authorization: 'Bearer' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      )
  }

  // Add favorite movie API call
  public addFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.put(apiURL + 'users/' + user + '/movies/' + movieID, 
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer' + token,
      })}).pipe(
        catchError(this.handleError)
      );
  }  

  // Delete favorite movie API call
  public removeFavoriteMovie(movieID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.delete(apiURL + 'users/' + user + '/movies/' + movieID + '/remove', 
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer' + token,
      })}).pipe(
        catchError(this.handleError)
      );
  } 

  // Edit user info API call
  public editUserProfile(userInfo: any): Observable<any> {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return this.http.put(apiURL + 'users/' + user,
    {headers: new HttpHeaders(
      {
        Authorization: 'Bearer' + token
      }
    )}).pipe(
      catchError(this.handleError)
    );
  }

    // Delete user account API call
    public removeUser(userInfo: any): Observable<any> {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return this.http.delete(apiURL + 'users/' + user, 
      {headers: new HttpHeaders(
        {
          Authorization: 'Bearer' + token,
        })}).pipe(
          catchError(this.handleError)
        );
    } 

  //Error handling for the API calls
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message)
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`
      );
    }
    return throwError(
      'Something bad happened; please try again later.');
  }

  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiURL + 'movies', {headers: new HttpHeaders(
      {
        Authorization: 'Bearer ' + token,
      })}).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
  }

  //Non-typed response extraction
  private extractResponseData(res: object): any {
    const body = res;
    return body || { };
  }
}
