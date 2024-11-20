import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Movie, MovieDetails, MovieVideo } from '../interfaces/movie';
import { Credits } from '../interfaces/credits';
import { ApiResponse } from '../interfaces/api-response';


@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = 'f2b11c4332af600fe89bc3bcf9ea3d6b';
  private apiUrl = 'https://api.themoviedb.org/3';


  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) { }

  private getLanguage(): string {
    return this.translate.currentLang || 'en-US';
  }

  getTrending(mediaType: string, period: string): Observable<ApiResponse<Movie>> {
    const url = `${this.apiUrl}/trending/${mediaType}/${period}?api_key=${this.apiKey}&language=${this.getLanguage()}`;
    return this.http.get<ApiResponse<Movie>>(url);
  }

  getMovieVideos(movieId: number): Observable<ApiResponse<MovieVideo>> {
    const url = `${this.apiUrl}/movie/${movieId}/videos?api_key=${this.apiKey}&language=${this.getLanguage()}`;
    return this.http.get<ApiResponse<MovieVideo>>(url);
  }

  getTopRatedMovies(): Observable<ApiResponse<Movie>> {
    const url = `${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}&language=${this.getLanguage()}`;
    return this.http.get<ApiResponse<Movie>>(url);
  }

  getUpcomingMovies(): Observable<ApiResponse<Movie>> {
    const url = `${this.apiUrl}/movie/upcoming?api_key=${this.apiKey}&language=${this.getLanguage()}`;
    return this.http.get<ApiResponse<Movie>>(url);
  }

  searchMovies(query: string, page: number = 1): Observable<ApiResponse<Movie>> {
    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}&language=${this.getLanguage()}`;
    return this.http.get<ApiResponse<Movie>>(url);
  }

  getMovieDetails(movieId: number): Observable<MovieDetails> {
    const url = `${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}&language=${this.getLanguage()}`;
    return this.http.get<MovieDetails>(url);
  }

  getMovieCredits(movieId: number): Observable<Credits> {
    const url = `${this.apiUrl}/movie/${movieId}/credits?api_key=${this.apiKey}&language=${this.getLanguage()}`;
    return this.http.get<Credits>(url);
  }

  getMoviesByGenre(genreId: number): Observable<ApiResponse<Movie>> {
    const url = `${this.apiUrl}/discover/movie?api_key=${this.apiKey}&with_genres=${genreId}&language=${this.getLanguage()}`;
    return this.http.get<ApiResponse<Movie>>(url);
  }
}
