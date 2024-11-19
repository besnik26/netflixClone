import { Component, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import Swiper from 'swiper';
import { TmdbService } from '../services/tmdb.service';
import { MovieModalComponent } from '../movie-modal/movie-modal.component';
import { ChangeDetectorRef } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-upcoming-movies',
  standalone: true,
  imports: [MovieModalComponent, TranslatePipe],
  templateUrl: './upcoming-movies.component.html',
  styleUrl: './upcoming-movies.component.css'
})
export class UpcomingMoviesComponent implements OnInit, AfterViewInit {
  upcomingMovies: any[] = [];
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper: Swiper | null = null;

  //Modal properties
  genres: string[] = [];
  cast: any[] = [];
  showModal: boolean = false;
  selectedMovie: any = null;

  constructor(private tmdbService: TmdbService, private cdr: ChangeDetectorRef, private translate: TranslateService) { }

  ngOnInit() {
    this.fetchUpcomingMovies();
    this.translate.onLangChange.subscribe(() => {
      this.upcomingMovies = [];
      this.fetchUpcomingMovies();
    });

  }

  ngAfterViewInit() {

  }

  initSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }

    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      spaceBetween: 30,
      grabCursor: true,
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
    this.tmdbService.getUpcomingMovies().subscribe(
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
    this.tmdbService.getMovieVideos(movieId).subscribe(videos => {
      const trailer = videos.results.find((video: any) => video.type === 'Trailer' && video.site === 'YouTube');
      if (trailer) {
        this.selectedMovie.trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
      } else {
        this.selectedMovie.trailerUrl = null;
      }
    });
  }

  onMovieClick(movie: any) {
    this.selectedMovie = movie;
    this.showModal = true;
    this.fetchTrailer(movie.id);
    this.tmdbService.getMovieDetails(movie.id).subscribe((details) => {
      this.genres = details.genres.map((genre: any) => genre.name);
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
