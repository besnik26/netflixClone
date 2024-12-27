import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService, TranslatePipe } from "@ngx-translate/core";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnDestroy{
  currentRoute?: string;
  private routerSubscription!: Subscription;

  constructor(private router: Router, private translate: TranslateService) {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url.split('/')[1];
    });
  }

  ngOnDestroy(): void {
    if(this.routerSubscription){
      this.routerSubscription.unsubscribe();
    }
  }
  
}
