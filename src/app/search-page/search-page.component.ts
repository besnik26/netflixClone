import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../services/tmdb.service';
import { MovieModalComponent } from "../movie-modal/movie-modal.component";
import { CdkScrollable, ScrollingModule } from '@angular/cdk/scrolling';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [MovieModalComponent, ScrollingModule, TranslatePipe],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit, OnDestroy {
  searchResults: any[] = [];
  query: string = '';

  //Modal properties
  selectedMovie: any = null;
  genres: string[] = [];
  cast: any[] = [];

  //Pagination properties
  currentPage: number = 1;
  isFetching: boolean = false;

  private languageChangeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private tmdbService: TmdbService
  ) { }

  ngOnInit() {
    console.log('SearchPageComponent initialized');
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      if (this.query) {
        this.resetSearch();
        this.fetchSearchResults(this.query, this.currentPage);
      }
    });
    this.subscribeToLanguageChanges();
  }
  ngOnDestroy() {
    if (this.languageChangeSubscription) {
      this.languageChangeSubscription.unsubscribe();
    }
  }


  resetSearch() {
    this.searchResults = [];
    this.currentPage = 1;
  }

  onMovieSelect(movie: any) {
    this.selectedMovie = movie;
    console.log('Movie selected:', this.selectedMovie);
    this.fetchAdditionalDetails(movie.id);
    this.fetchTrailer(movie.id);
  }

  fetchAdditionalDetails(movieId: number) {
    this.tmdbService.getMovieDetails(movieId).subscribe(details => {
      this.genres = details.genres.map((g: any) => g.name);
    });

    this.tmdbService.getMovieCredits(movieId).subscribe(credits => {
      this.cast = credits.cast.slice(0, 5);
    });
  }

  private subscribeToLanguageChanges() {
    console.log('Subscribing to language changes');
    this.languageChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      console.log('Language changed, refreshing content');

      this.resetSearch();
      this.fetchSearchResults(this.query, this.currentPage);
    });
  }



  refetchSelectedMovie(movieId: number) {
    console.log('Refetching movie details for ID:', movieId);
    this.tmdbService.getMovieDetails(movieId).subscribe(movieDetails => {
      this.selectedMovie = {
        ...this.selectedMovie,
        ...movieDetails
      };
      console.log('Updated selectedMovie:', this.selectedMovie);
      this.genres = movieDetails.genres.map((g: any) => g.name);
    });

    this.tmdbService.getMovieCredits(movieId).subscribe(credits => {
      this.cast = credits.cast.slice(0, 5);
    });
  }

  fetchTrailer(movieId: number) {
    this.tmdbService.getMovieVideos(movieId).subscribe(videos => {
      const trailer = videos.results.find((video: any) => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        this.selectedMovie.trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
      } else {
        this.selectedMovie.trailerUrl = null;
      }
    });
  }

  closeModal() {
    console.log('Closing modal, resetting selectedMovie');
    this.selectedMovie = null;
  }


  fetchSearchResults(query: string, page: number = 1) {
    if (this.isFetching) return;
    this.isFetching = true;

    this.tmdbService.searchMovies(query, page).subscribe(
      (response) => {
        if (response.results.length) {
          this.searchResults = [...this.searchResults, ...response.results];
          this.currentPage = page;
        }
        this.isFetching = false;
      },
      (error) => {
        console.error('Error fetching search results:', error);
        this.isFetching = false;
      }
    );
  }

  onScroll() {
    const nextPage = this.currentPage + 1;
    this.fetchSearchResults(this.query, nextPage);
  }


}
