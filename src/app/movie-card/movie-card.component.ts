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
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    public router: Router,
    ) { }

  ngOnInit(): void {
    this.getFavorites();
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies=resp;
      return this.movies;
    });
  }

  getFavorites(): void {
    this.fetchApiData.getUserInfo().subscribe((resp: any) => {
      this.favorites=resp.favoriteMovies;
      return this.favorites;
    })
  }

  openGenreView(genreData: any): void {
    this.dialog.open(GenreViewComponent, { 
      width: '280px',
      data: { 
        name: genreData.Name,
        description: genreData.Description
      }
    });
  }

  openDirectorView(directorData: any): void {
    this.dialog.open(DirectorViewComponent, {
      width: '400px',
      data: directorData
    });
  }

  openMovieDescription(movieData: any): void {
    this.dialog.open(MovieDescriptionComponent, {
      width: '400px',
      data: movieData
    });
  }

  isFavorite(movieID: string): boolean {
    console.log("Movie ID " + movieID + "favorite check");
    return this.favorites.includes(movieID);
  };

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

  logOutUser(): void {
    this.snackBar.open("You have been logged out", 'OK', {duration: 2000});
    this.router.navigate(['welcome']);
  }
}
