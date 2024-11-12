import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { TmdbService } from '../services/tmdb.service';
@Component({
  selector: 'app-top-rated-movies',
  standalone: true,
  imports: [],
  templateUrl: './top-rated-movies.component.html',
  styleUrl: './top-rated-movies.component.css'
})
export class TopRatedMoviesComponent implements OnInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  topRatedMovies: any[] = [];
  swiper: Swiper | null = null;

  constructor(private tmdbService: TmdbService) { }

  ngOnInit() {
    this.fetchTopRatedMovies();
    setTimeout(() => {
      this.initSwiper()
    }, 200)
  }

  initSwiper() {
    this.swiper = new Swiper(this.swiperContainer.nativeElement, {
      spaceBetween: 30,
      slidesPerView: 10.5

    });
  }


  fetchTopRatedMovies() {
    this.tmdbService.getTopRatedMovies().subscribe(
      (data) => {
        this.topRatedMovies = data.results;
      },
      (error) => {
        console.error('Error fetching top-rated movies:', error);
      }
    );
  }
}
