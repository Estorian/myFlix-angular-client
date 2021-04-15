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

  /**
   * Register a new User
   * @param userDetails 
   * @returns Observable that will return a plain text response from the API
   * userDetails should match the following format:
   * ```
   * 
   * {
   *    username: <string>,
   *    password: <string>,
   *    email: <string>,
   *    Birthday: <date>
   * }
   * ```
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiURL + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * 
   * @param username <string>
   * @param password <string>
   * @returns Observable that will return a JWT if login is successful.
   */
  public userLogin(username: string, password: string): Observable<any> {
    return this.http.post(apiURL + 'login', {
      Username: username,
      Password: password
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    )
  }

  /**
   * 
   * @param directorName 
   * @returns 
   */
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

  /**
   * 
   * @returns Observable that will return a user's profile information.
   * This JSON object will contain the following:
   * ```
   * {
   *    _id: <string>,
   *    username: <string>,
   *    password: <string>, // Note that this field will be hashed for security
   *    email: <string>,
   *    Birthday: <date>,
   *    favoriteMovies: <Array> [ //Note that these are IDs, not movie objects
   *      0: <string>,
   *      1: <string>, ...
   *    ]
   * }
   * ```
   */
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

  /**
   * 
   * @param movieID This is a unique ID to the movie to be added.
   * @returns Observable
   * This function adds the movie ID to the Array of favoriteMovies
   * in the user profile.
   */
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

  /**
   * 
   * @param movieID This is a unique ID to the movie to be removed.
   * @returns Observable
   * This function removes the movie ID from the array of favoriteMovies
   * in the user profile.
   */
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

    /**
     * 
     * @returns Observable
     * This function is not implemented in the final project (yet).
     * It can be used to delete a user account.
     */
    public removeUser(): Observable<any> {
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

  /**
   * 
   * @returns Observable that will return an array of movies.
   * Note that this function will not store the movies, but 
   * does retrieve them. Movies will be in this format:
   * ```
   * {
   *    _id:<string>,
   *  Title: "The movie's title",
   *  Description: "A brief synopsis of the movie."
   *  Genre: {
   *    Name: "Genre Name",
   *    Description: "Definition of the Genre"
   *  }
   *  Director: {
   *    Name: "Director's Name",
   *    Bio: "A brief biography of the director",
   *    Birth: "The director's birth year"
   *  }
   *  ImageURL: "https://URL.for.an.Image.of.the.movie"
   *  Featured: <bool>
   * }
   * ```
   */
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
