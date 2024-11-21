import { Component, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import Swiper from 'swiper';
import { TmdbService } from '../services/tmdb.service';
import { MovieModalComponent } from '../shared/movie-modal/movie-modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Movie, MovieVideo } from '../interfaces/movie';
import { CastMember } from '../interfaces/credits';
import { Genre } from '../interfaces/genre';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-top-rated-movies',
  standalone: true,
  imports: [MovieModalComponent, TranslatePipe],
  templateUrl: './top-rated-movies.component.html',
  styleUrl: './top-rated-movies.component.css'
})
export class TopRatedMoviesComponent implements OnInit, OnDestroy {

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  topRatedMovies: Movie[] = [];
  swiper: Swiper | null = null;


  //Modal properties
  genres: string[] = [];
  cast: CastMember[] = [];
  showModal: boolean = false;
  selectedMovie: Movie | null = null;

  private languageChangeSub: Subscription | null = null;

  constructor(private tmdbService: TmdbService, private cdr: ChangeDetectorRef, private translate: TranslateService) { }

  ngOnInit() {
    this.fetchTopRatedMovies()
    this.languageChangeSub = this.translate.onLangChange.subscribe(() => {
      this.topRatedMovies = [];
      this.fetchTopRatedMovies();
    });
  }

  ngOnDestroy() {
    if (this.languageChangeSub) {
      this.languageChangeSub.unsubscribe();
    }
    if (this.swiper) {
      this.swiper.destroy();
    }
  }

  initSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }


    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      spaceBetween: 30,
      breakpoints: {
        320: {
          slidesPerView: 2.5
        },
        375: {
          slidesPerView: 3.5
        },
        550: {
          slidesPerView: 5.5
        },
        900: {
          slidesPerView: 6.5
        },
        1250: {
          slidesPerView: 8.5
        },
        1500: {
          slidesPerView: 10.5
        }
      }
    });
  }


  fetchTopRatedMovies() {
    this.tmdbService.getTopRatedMovies().subscribe(
      (data) => {
        this.topRatedMovies = data.results;
        this.cdr.detectChanges();
        this.initSwiper();
      },
      (error) => {
        console.error('Error fetching top-rated movies:', error);
      }
    );
  }


  fetchTrailer(movieId: number) {
    this.tmdbService.getMovieVideos(movieId).subscribe(videos => {
      const trailer = videos.results.find((video: MovieVideo) => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer && this.selectedMovie) {
        this.selectedMovie.trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
      } else if (this.selectedMovie) {
        this.selectedMovie.trailerUrl = null;
      }
    });
  }

  onMovieClick(movie: Movie) {
    this.selectedMovie = movie;
    this.showModal = true;
    this.fetchTrailer(movie.id);
    this.tmdbService.getMovieDetails(movie.id).subscribe((details) => {
      this.genres = details.genres.map((genre: Genre) => genre.name);
    });

    this.tmdbService.getMovieCredits(movie.id).subscribe((credits) => {
      this.cast = credits.cast.slice(0, 5);
    });
    this.cdr.detectChanges();
  }

  closeModal() {
    this.showModal = false;
    this.selectedMovie = null
  }


}
