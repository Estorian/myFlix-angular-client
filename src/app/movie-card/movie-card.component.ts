import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DirectorViewComponent } from '../director-view/director-view.component';
import { FetchApiDataService } from '../fetch-api-data.service';
import { GenreViewComponent } from '../genre-view/genre-view.component';
import { MovieDescriptionComponent } from '../movie-description/movie-description.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
/**
 * The MovieCardComponent is the main view of the app.
 * It makes a call to the myFlix database API to populate 
 * the list of movies and mark a user's favorite movies in 
 * that list.
 */
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    ) { }

    /**  Upon being mounted, the component makes two async calls that will
     * first get the list of favorite movie ID's from the user's profile.
     * Then it will load the movies, which will map to the individual movie
     * cards, including its favorite status.
     */
  ngOnInit(): void {
    this.getFavorites();
    this.getMovies();
  }

  //Makes an async API call to get the list of movies.
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies=resp;
      return this.movies;
    });
  }

  //Makes an async API to get the list of favorite movie IDs.
  getFavorites(): void {
    this.fetchApiData.getUserInfo().subscribe((resp: any) => {
      this.favorites=resp.favoriteMovies;
      return this.favorites;
    })
  }

  /**
   * 
   * @param genreData genreData should be an object containing two strings with
   * the keys Name and Description.
   * ```typescript
   * //Example:
   * genreData = {
   *    Name: "Action",
   *    Description: "Action movies are defined by a ..."
   * }
   * ```
   * 
   * Opens a small dialog using the GenreViewComponent that
   * defines the genre of the specific movie.
   */
  openGenreView(genreData: any): void {
    this.dialog.open(GenreViewComponent, { 
      width: '280px',
      data: { 
        name: genreData.Name,
        description: genreData.Description
      }
    });
  }

  /**
   * 
   * @param directorData should be structures as an object
   * containing two strings for Name and Bio, and a number for Birth.
   * ```typescript
   * //Example:
   * directorData = {
   *    Name: "Steven Spielberg",
   *    Bio: "A particularly cool dude who directed...",
   *    Birth: 1946
   * }
   * ``` 
   * 
   * Opens a small dialog using the DirectorViewComponent 
   * that gives the bio and birth year of the director of 
   * the specific movie.
   */
  openDirectorView(directorData: any): void {
    this.dialog.open(DirectorViewComponent, {
      width: '400px',
      data: directorData
    });
  }

  /**
   * 
   * @param movieData comes from the movie itself.
   * This will open a small dialog dialog that has a synopsis of the movie.
   */
  openMovieDescription(movieData: any): void {
    this.dialog.open(MovieDescriptionComponent, {
      width: '400px',
      data: movieData
    });
  }

  // Checks the movieID against the list of favorites and returns a boolean.
  isFavorite(movieID: string): boolean {
    console.log("Movie ID " + movieID + "favorite check");
    return this.favorites.includes(movieID);
  };

  //Checks if the movie is currently a favorite, then toggles its status.
  clickFavorite(movieID: string): void {
    if (this.isFavorite(movieID)) {
      this.fetchApiData.removeFavoriteMovie(movieID).subscribe(() => {
        this.snackBar.open("Removied from favorites", 'OK', {
          duration: 2000
        });
        this.getFavorites();
      });
    } else {
      this.fetchApiData.addFavoriteMovie(movieID).subscribe(() => {
        this.snackBar.open("Added to Favorites", 'OK', {
          duration: 2000
        });
        this.getFavorites();
      });
    }
  }

  //Allows the user to log out of the app.
  logOutUser(): void {
    this.snackBar.open("You have been logged out", 'OK', {duration: 2000});
    this.router.navigate(['welcome']);
  }
}
