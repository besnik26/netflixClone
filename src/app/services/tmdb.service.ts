import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private apiKey = 'f2b11c4332af600fe89bc3bcf9ea3d6b';
  private apiUrl = 'https://api.themoviedb.org/3';


  constructor(private http: HttpClient) { }

  getTrending(mediaType: string, period: string): Observable<any> {
    const url = `${this.apiUrl}/trending/${mediaType}/${period}?api_key=${this.apiKey}&language=en-US`;
    return this.http.get<any>(url);
  }

  getMovieVideos(movieId: number): Observable<any> {
    const url = `${this.apiUrl}/movie/${movieId}/videos?api_key=${this.apiKey}&language=en-US`;
    return this.http.get<any>(url);
  }

  getTopRatedMovies(): Observable<any> {
    const url = `${this.apiUrl}/movie/top_rated?api_key=${this.apiKey}&language=en-US`;
    return this.http.get<any>(url);
  }

  getUpcomingMovies(): Observable<any> {
    const url = `${this.apiUrl}/movie/upcoming?api_key=${this.apiKey}&language=en-US`;
    return this.http.get<any>(url);
  }

  searchMovies(query: string): Observable<any> {
    const url = `${this.apiUrl}/search/movie?api_key=${this.apiKey}&query=${query}&language=en-US`;
    return this.http.get<any>(url);
  }

  getMovieDetails(movieId: number): Observable<any> {
    const url = `${this.apiUrl}/movie/${movieId}?api_key=${this.apiKey}&language=en-US`;
    return this.http.get<any>(url);
  }

  getMovieCredits(movieId: number): Observable<any> {
    const url = `${this.apiUrl}/movie/${movieId}/credits?api_key=${this.apiKey}&language=en-US`;
    return this.http.get<any>(url);
  }
}
