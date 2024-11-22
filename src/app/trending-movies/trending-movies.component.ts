import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TmdbService } from '../services/tmdb.service';
import Swiper from 'swiper';
import { SafeurlPipe } from '../pipes/safeurl.pipe';
import { MovieModalComponent } from '../shared/movie-modal/movie-modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Movie, MovieDetails, MovieVideo } from '../interfaces/movie';
import { CastMember } from '../interfaces/credits';

@Component({
  selector: 'app-trending-movies',
  standalone: true,
  imports: [SafeurlPipe, MovieModalComponent, TranslatePipe],
  templateUrl: './trending-movies.component.html',
  styleUrl: './trending-movies.component.css'
})
export class TrendingMoviesComponent implements OnInit, OnDestroy {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  trendingMovies: Movie[] = [];
  mediaType: string = 'movie';
  period: string = 'week';
  swiper: Swiper | null = null;
  selectedMovieVideo: string | null = null;


  //Modal properties
  genres: string[] = [];
  cast: CastMember[] = [];
  showModal: boolean = false;
  selectedMovie: Movie | null = null;
  private languageChangeSub: Subscription | null = null;

  private destroy$ = new Subject<void>();

  constructor(private tmdbService: TmdbService, private cdr: ChangeDetectorRef, private translateService: TranslateService) { }

  ngOnInit() {
    this.fetchTrendingMovies();
    this.languageChangeSub = this.translateService.onLangChange.subscribe(() => {
      this.trendingMovies = [];
      this.fetchTrendingMovies();
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

  fetchTrendingMovies() {
    this.tmdbService.getTrending(this.mediaType, this.period).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data) => {
        this.trendingMovies = data.results;
        if (this.trendingMovies.length > 0) {
          this.loadMovieVideo(this.trendingMovies[0].id);
        }
        this.cdr.detectChanges();
        this.initSwiper();
      },
      (error) => {
        console.error('Error fetching trending data:', error);
      }
    );
  }

  loadMovieVideo(movieId: number) {
    this.tmdbService.getMovieVideos(movieId).pipe(
      takeUntil(this.destroy$)
    ).subscribe(
      (data) => {
        const video = data.results.find((vid: MovieVideo) => vid.type === 'Trailer' && vid.site === 'YouTube');
        this.selectedMovieVideo = video ? `https://www.youtube.com/embed/${video.key}` : null;
      },
      (error) => {
        console.error('Error fetching movie videos:', error);
      }
    );
  }


  fetchTrailer(movieId: number) {
    this.tmdbService.getMovieVideos(movieId).pipe(
      takeUntil(this.destroy$)
    ).subscribe(videos => {
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

    this.tmdbService.getMovieDetails(movie.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe((details: MovieDetails) => {
      this.genres = details.genres.map((genre: { name: string }) => genre.name);
      this.cdr.detectChanges();
    });

    this.tmdbService.getMovieCredits(movie.id).pipe(
      takeUntil(this.destroy$)
    ).subscribe((credits) => {
      this.cast = credits.cast.slice(0, 5);
      this.cdr.detectChanges();
    });

    this.fetchTrailer(movie.id);
  }

  closeModal() {
    this.showModal = false;
    this.selectedMovie = null
  }
}