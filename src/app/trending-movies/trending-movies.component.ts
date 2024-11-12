import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TmdbService } from '../services/tmdb.service';
import Swiper from 'swiper';
import { SafeurlPipe } from '../pipes/safeurl.pipe';

@Component({
  selector: 'app-trending-movies',
  standalone: true,
  imports: [SafeurlPipe],
  templateUrl: './trending-movies.component.html',
  styleUrl: './trending-movies.component.css'
})
export class TrendingMoviesComponent implements OnInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  trendingMovies: any[] = [];
  mediaType: string = 'movie';
  period: string = 'week';
  swiper: Swiper | null = null;
  selectedMovieVideo: string | null = null;

  constructor(private tmdbService: TmdbService) { }

  ngOnInit() {
    this.fetchTrendingMovies();
    setTimeout(() => {
      this.initSwiper()
    }, 200)
  }



  initSwiper() {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      spaceBetween: 30,
      slidesPerView: 10.5,
      grabCursor: true

    });
  }

  fetchTrendingMovies() {
    this.tmdbService.getTrending(this.mediaType, this.period).subscribe(
      (data) => {
        this.trendingMovies = data.results;
        if (this.trendingMovies.length > 0) {
          this.loadMovieVideo(this.trendingMovies[0].id);
        }
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
}