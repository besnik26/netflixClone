import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { TmdbService } from '../services/tmdb.service';
import { TrendingMoviesComponent } from "../trending-movies/trending-movies.component";
import { TopRatedMoviesComponent } from "../top-rated-movies/top-rated-movies.component";
import { UpcomingMoviesComponent } from "../upcoming-movies/upcoming-movies.component";

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [HeaderComponent, TrendingMoviesComponent, TopRatedMoviesComponent, UpcomingMoviesComponent],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent implements OnInit {
  trendingMovies: any[] = [];
  mediaType: string = 'movie';
  period: string = 'week';

  constructor(private tmdbService: TmdbService) { }

  ngOnInit() {
    this.fetchTrendingMovies();
  }

  fetchTrendingMovies() {
    this.tmdbService.getTrending(this.mediaType, this.period).subscribe(
      (data) => {
        this.trendingMovies = data.results;
      },
      (error) => {
        console.error('Error fetching trending data:', error);
      }
    );
  }

}
