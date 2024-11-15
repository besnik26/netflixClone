import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TmdbService } from '../services/tmdb.service';
import Swiper from 'swiper';
import { SafeurlPipe } from '../pipes/safeurl.pipe';
import { MovieModalComponent } from '../movie-modal/movie-modal.component';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-trending-movies',
  standalone: true,
  imports: [SafeurlPipe, MovieModalComponent],
  templateUrl: './trending-movies.component.html',
  styleUrl: './trending-movies.component.css'
})
export class TrendingMoviesComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  trendingMovies: any[] = [];
  mediaType: string = 'movie';
  period: string = 'week';
  swiper: Swiper | null = null;
  selectedMovieVideo: string | null = null;


  //Modal properties
  genres: string[] = [];
  cast: any[] = [];
  showModal: boolean = false;
  selectedMovie: any = null;

  constructor(private tmdbService: TmdbService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.fetchTrendingMovies();
  }

  ngAfterViewInit() {

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
    this.tmdbService.getTrending(this.mediaType, this.period).subscribe(
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
    this.tmdbService.getMovieVideos(movieId).subscribe(
      (data) => {
        const video = data.results.find((vid: any) => vid.type === 'Trailer' && vid.site === 'YouTube');
        if (video) {
          this.selectedMovieVideo = `https://www.youtube.com/embed/${video.key}`;
        } else {
          this.selectedMovieVideo = null;
        }
      },
      (error) => {
        console.error('Error fetching movie videos:', error);
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