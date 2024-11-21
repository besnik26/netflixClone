import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:3000/users';

    constructor(private http: HttpClient) { }

    login(email: string, password: string): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`);
    }

    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    logout(): void {
        localStorage.removeItem('token');
    }
}
