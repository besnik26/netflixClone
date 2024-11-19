import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { SafeurlPipe } from '../pipes/safeurl.pipe';
import { TmdbService } from '../services/tmdb.service';
import { ChangeDetectorRef } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-movie-modal',
  standalone: true,
  imports: [SafeurlPipe, TranslatePipe],
  templateUrl: './movie-modal.component.html',
  styleUrl: './movie-modal.component.css'
})
export class MovieModalComponent implements OnInit, OnChanges {
  @Input() movie: any;
  @Input() genres: string[] = [];
  @Input() cast: any[] = [];
  similarMovies: any[] = [];
  @Output() close = new EventEmitter<void>();

  @ViewChild('modal') modalElement!: ElementRef;


  constructor(private tmdbService: TmdbService, private translateService: TranslateService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    setTimeout(() => {
      this.fetchSimilarMovies();
    }, 200)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['movie'] && changes['movie'].currentValue) {
      console.log('Movie details updated:', this.movie);
    }
  }

  fetchSimilarMovies() {
    const currentLanguage = this.translateService.currentLang || 'en';

    if (this.genres && this.genres.length > 0) {
      const mainGenreId = this.movie.genre_ids[0];
      this.tmdbService.getMoviesByGenre(mainGenreId).subscribe(response => {
        this.similarMovies = response.results.slice(0, 6);
        this.cdr.detectChanges();

      },
        (error) => {
          console.error('Error fetching similar movies:', error);
        }
      );
    }
  }

  onClose() {
    this.close.emit();
  }
  get castList(): string {
    return this.cast.map(actor => actor.name).join(', ');
  }

  fetchTrailer(movieId: number) {
    this.tmdbService.getMovieVideos(movieId).subscribe(videos => {
      const trailer = videos.results.find((video: any) => video.type === 'Trailer' && video.site === 'YouTube');
      this.movie.trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
      this.cdr.detectChanges();
    });
  }

  selectMainMovie(newMovie: any) {
    const currentLanguage = this.translateService.currentLang || 'en';
    this.movie = newMovie;
    this.cast = [];
    this.genres = [];

    this.tmdbService.getMovieDetails(newMovie.id).subscribe(details => {
      this.movie = { ...this.movie, ...details };
      this.genres = details.genres.map((genre: any) => genre.name);
      this.cdr.detectChanges();
    });

    this.tmdbService.getMovieCredits(newMovie.id).subscribe(credits => {
      this.cast = credits.cast.slice(0, 5);
      this.cdr.detectChanges();
    });

    this.fetchTrailer(newMovie.id);
    this.fetchSimilarMovies();

    this.scrollToTop();
  }

  scrollToTop() {
    if (this.modalElement) {
      this.modalElement.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
}
