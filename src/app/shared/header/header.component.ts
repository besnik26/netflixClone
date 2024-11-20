import { Component, Input, OnInit, HostListener } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  FormsModule
} from "@angular/forms";
import { NgClass } from '@angular/common';
import { ElementRef } from '@angular/core';
import { Router, RouterLink, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass, FormsModule, TranslatePipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  menuOpen: boolean = false
  currentRoute?: string;
  @Input() section: string = '';
  myForm!: FormGroup;

  isOpen = false;

  languages = ['en', 'de'];
  selectedLanguage = 'en';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private elementRef: ElementRef,
  ) {
    this.myForm = this.formBuilder.group({
      search: ['', Validators.required,]
    })

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url.split('/')[1];
    });

    this.translate.setDefaultLang(this.selectedLanguage);

  }

  ngOnInit() {
    this.currentRoute = this.router.url.split('/')[1];
  }

  onSubmit() {
    if (this.myForm.valid) {
      const query = this.myForm.value.search;
      this.router.navigate(['/search'], { queryParams: { query } });
      this.menuOpen = false;
    }
  }
  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }
  @HostListener('document:click', ['$event'])
  ClickOut(event: MouseEvent) {
    const isClickedOutside = !this.elementRef.nativeElement.contains(
      event.target as Node
    );
    if (isClickedOutside) {
      this.menuOpen = false;
      this.isOpen = false;
    }
  }

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.translate.use(lang);
    this.closeDropdown();
    this.menuOpen = false;
  }

  goToBrowse() {
    this.router.navigate(['/browse']);
    this.menuOpen = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
    this.menuOpen = false;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.isOpen = false
  }
}