import { Component, OnInit, Input, Output, ViewChild, ElementRef, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { SafeurlPipe } from '../../pipes/safeurl.pipe';
import { TmdbService } from '../../services/tmdb.service';
import { ChangeDetectorRef } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Movie, MovieVideo } from '../../interfaces/movie';
import { CastMember } from '../../interfaces/credits';
import { Genre } from '../../interfaces/genre';
import { Subject } from 'rxjs';
import { takeUntil, } from 'rxjs';


@Component({
  selector: 'app-movie-modal',
  standalone: true,
  imports: [SafeurlPipe, TranslatePipe],
  templateUrl: './movie-modal.component.html',
  styleUrl: './movie-modal.component.css'
})
export class MovieModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() movie!: Movie;
  @Input() genres: string[] = [];
  @Input() cast: CastMember[] = [];
  similarMovies: Movie[] = [];
  @Output() closeModal = new EventEmitter<void>();

  @ViewChild('modal') modalElement!: ElementRef;

  private destroy$ = new Subject<void>();


  constructor(private tmdbService: TmdbService, private elementRef: ElementRef, private translateService: TranslateService, private cdr: ChangeDetectorRef) { }

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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchSimilarMovies() {
    if (this.genres && this.genres.length > 0) {
      const mainGenreId = this.movie.genre_ids[0];
      this.tmdbService.getMoviesByGenre(mainGenreId).pipe(
        takeUntil(this.destroy$)
      ).subscribe(response => {
        this.similarMovies = response.results.slice(0, 6);
        this.cdr.detectChanges();
      }, error => {
        console.error('Error fetching similar movies:', error);
      });
    }
  }


  onClose() {
    this.closeModal.emit();
  }
  get castList(): string {
    return this.cast.map((actor: CastMember) => actor.name).join(', ');
  }

  fetchTrailer(movieId: number) {
    this.tmdbService.getMovieVideos(movieId).pipe(
      takeUntil(this.destroy$)
    ).subscribe(videos => {
      const trailer = videos.results.find((video: MovieVideo) => video.type === 'Trailer' && video.site === 'YouTube');
      this.movie.trailerUrl = trailer ? `https://www.youtube.com/embed/${trailer.key}` : null;
      this.cdr.detectChanges();
    });
  }

  selectMainMovie(newMovie: Movie) {
    this.movie = newMovie;
    this.cast = [];
    this.genres = [];

    this.tmdbService.getMovieDetails(newMovie.id).subscribe(details => {
      this.movie = { ...this.movie, ...details };
      this.genres = details.genres.map((genre: Genre) => genre.name);
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
