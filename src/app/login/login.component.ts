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

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.buildForm();

  }

  private buildForm() {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required,],
      password: ['', Validators.required]
    })
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
      console.log(this.myForm.value);

      this.router.navigate(['/browse']);

    }
    else {
      this.markFormGroupTouched(this.myForm);
    }
  }
}
