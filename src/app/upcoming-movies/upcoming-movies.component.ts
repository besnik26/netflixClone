import { Component, ElementRef, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import Swiper from 'swiper';
import { TmdbService } from '../services/tmdb.service';
import { MovieModalComponent } from '../shared/movie-modal/movie-modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Movie, MovieVideo } from '../interfaces/movie';
import { CastMember } from '../interfaces/credits';
import { Genre } from '../interfaces/genre';
import { Subscription, Subject, forkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-upcoming-movies',
  standalone: true,
  imports: [MovieModalComponent, TranslatePipe],
  templateUrl: './upcoming-movies.component.html',
  styleUrl: './upcoming-movies.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpcomingMoviesComponent implements OnInit, OnDestroy {
  upcomingMovies: Movie[] = [];
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper: Swiper | null = null;

  //Modal properties
  genres: string[] = [];
  cast: CastMember[] = [];
  showModal: boolean = false;
  selectedMovie: Movie | null = null;

  private languageChangeSub: Subscription | null = null;
  private destroy$ = new Subject<void>();

  constructor(private tmdbService: TmdbService, private cdr: ChangeDetectorRef, private translate: TranslateService) { }

  ngOnInit() {
    this.fetchUpcomingMovies();
    this.languageChangeSub = this.translate.onLangChange.subscribe(() => {
      this.upcomingMovies = [];
      this.fetchUpcomingMovies();
    });

  }
  ngOnDestroy() {

    this.destroy$.next();
    this.destroy$.complete();

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

  fetchUpcomingMovies() {
    this.tmdbService
      .getUpcomingMovies()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data) => {
          this.upcomingMovies = data.results;
          this.cdr.detectChanges();
          this.initSwiper();
        },
        (error) => {
          console.error('Error fetching upcoming movies:', error);
        }
      );
  }

  fetchTrailer(movieId: number) {
    this.tmdbService
      .getMovieVideos(movieId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((videos) => {
        const trailer = videos.results.find(
          (video: MovieVideo) => video.type === 'Trailer' && video.site === 'YouTube'
        );
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

    const details$ = this.tmdbService.getMovieDetails(movie.id);
    const credits$ = this.tmdbService.getMovieCredits(movie.id);

    forkJoin([details$, credits$]).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      ([details, credits]) => {
        this.genres = details.genres.map((genre: Genre) => genre.name);
        this.cast = credits.cast.slice(0, 5);

        this.fetchTrailer(movie.id);

        this.cdr.detectChanges();
      },
      (error) => {
        console.error('Error fetching movie details or credits:', error);
      }
    );
  }

  closeModal() {
    this.showModal = false;
    this.selectedMovie = null
  }
}
