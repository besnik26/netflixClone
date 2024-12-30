import { Component, OnDestroy, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatIconModule, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  hide = signal(true);
  myForm!: FormGroup;

  private destroy$ = new Subject<void>();

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private buildForm() {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required,],
      password: ['', Validators.required]
    })

    this.myForm.get('email')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.myForm.get('email')?.setErrors(null);
      this.myForm.get('password')?.setErrors(null);
    });

    this.myForm.get('password')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.myForm.get('email')?.setErrors(null);
      this.myForm.get('password')?.setErrors(null);
    });
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
    })
  }

  onSubmit() {
    this.markFormGroupTouched(this.myForm);

    if (this.myForm.valid) {
      const { email, password } = this.myForm.value;

      if (email?.trim() && password?.trim()) {
        this.authService.login(email, password).pipe(takeUntil(this.destroy$)).subscribe(users => {
          if (users.length > 0) {
            this.authService.saveToken('dummy-token');
            this.router.navigate(['/browse']);
          } else {
            this.setInvalidCredentialsError();
          }
        });
      } else {
        if (!email?.trim()) this.myForm.get('email')?.setErrors({ required: true });
        if (!password?.trim()) this.myForm.get('password')?.setErrors({ required: true });
      }
    }
  }

  private setInvalidCredentialsError() {
    this.myForm.get('email')?.setErrors({ invalidCredentials: true });
    this.myForm.get('password')?.setErrors({ invalidCredentials: true });
  }
}
