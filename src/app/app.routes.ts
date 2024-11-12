import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BrowseComponent } from './browse/browse.component';
import { SearchPageComponent } from './search-page/search-page.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'browse', component: BrowseComponent },
    { path: 'search', component: SearchPageComponent },
];
