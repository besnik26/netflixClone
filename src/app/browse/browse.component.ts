import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
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
export class BrowseComponent {


  constructor() { }



}
