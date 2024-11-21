import { Component, signal } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatIconModule, ReactiveFormsModule,],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  hide = signal(true);
  myForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private router: Router, private authService: AuthService) {
    this.buildForm();
  }

  private buildForm() {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required,],
      password: ['', Validators.required]
    })

    this.myForm.get('email')?.valueChanges.subscribe(() => {
      this.myForm.get('email')?.setErrors(null);
      this.myForm.get('password')?.setErrors(null);
    });

    this.myForm.get('password')?.valueChanges.subscribe(() => {
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
    if (this.myForm.valid) {
      const { email, password } = this.myForm.value;

      this.authService.login(email, password).subscribe(users => {
        if (users.length > 0) {

          this.authService.saveToken('dummy-token');
          this.router.navigate(['/browse']);
        } else {

          this.myForm.get('email')?.setErrors({ invalidCredentials: true });
          this.myForm.get('password')?.setErrors({ invalidCredentials: true });
        }
      });
    } else {
      this.markFormGroupTouched(this.myForm);
    }
  }
}
