import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { TmdbService } from '../services/tmdb.service';

@Component({
  selector: 'app-upcoming-movies',
  standalone: true,
  imports: [],
  templateUrl: './upcoming-movies.component.html',
  styleUrl: './upcoming-movies.component.css'
})
export class UpcomingMoviesComponent {
  upcomingMovies: any[] = [];
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;
  swiper: Swiper | null = null;

  constructor(private tmdbService: TmdbService) { }

  ngOnInit() {
    this.fetchUpcomingMovies();
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

  fetchUpcomingMovies() {
    this.tmdbService.getUpcomingMovies().subscribe(
      (data) => {
        this.upcomingMovies = data.results;
      },
      (error) => {
        console.error('Error fetching upcoming movies:', error);
      }
    );
  }
}
