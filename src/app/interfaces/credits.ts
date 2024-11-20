export interface Credits {
    cast: CastMember[];
    crew: CastMember[];
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string;
}