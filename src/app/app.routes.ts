import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { BrowseComponent } from './pages/browse/browse.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'browse', component: BrowseComponent, canActivate: [authGuard] },
    { path: 'search', component: SearchPageComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
];
