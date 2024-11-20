export interface Movie {
    id: number;
    title: string;
    overview: string;
    release_date: string;
    poster_path: string;
    backdrop_path: string;
    genre_ids: number[];
    vote_average: number;
    trailerUrl?: string | null;
}

export interface MovieDetails extends Movie {
    genres: { id: number; name: string }[];
    runtime: number;
}

export interface MovieVideo {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}