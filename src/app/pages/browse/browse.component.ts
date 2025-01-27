import { Component } from '@angular/core';
import { TrendingMoviesComponent } from '../../components/trending-movies/trending-movies.component';
import { TopRatedMoviesComponent } from '../../components/top-rated-movies/top-rated-movies.component';
import { UpcomingMoviesComponent } from '../../components/upcoming-movies/upcoming-movies.component';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [TrendingMoviesComponent, TopRatedMoviesComponent, UpcomingMoviesComponent],
  templateUrl: './browse.component.html',
  styleUrl: './browse.component.css'
})
export class BrowseComponent {


}
