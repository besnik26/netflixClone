import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../services/tmdb.service';
import { MovieModalComponent } from "../movie-modal/movie-modal.component";

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [MovieModalComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent implements OnInit {
  searchResults: any[] = [];
  query: string = '';
  selectedMovie: any = null;
  genres: string[] = [];
  cast: any[] = [];

  constructor(private route: ActivatedRoute, private tmdbService: TmdbService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.query = params['query'] || '';
      if (this.query) {
        this.fetchSearchResults(this.query);
      }
    });
  }

  onMovieSelect(movie: any) {
    this.selectedMovie = movie;
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
    this.selectedMovie = null;
  }

  fetchSearchResults(query: string) {
    this.tmdbService.searchMovies(query).subscribe(
      (response) => {
        this.searchResults = response.results;
      },
      (error) => {
        console.error('Error fetching search results:', error);
      }
    );
  }


}
