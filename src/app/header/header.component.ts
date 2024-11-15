import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { NgClass } from '@angular/common';

import { Router, RouterLink, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, NgClass],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  menuOpen: boolean = false
  currentRoute?: string;
  @Input() section: string = '';
  myForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {
    this.myForm = this.formBuilder.group({
      search: ['', Validators.required,]
    })

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentRoute = this.router.url.split('/')[1];
    });
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

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/home']);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
