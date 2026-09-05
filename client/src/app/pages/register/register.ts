import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Auth } from '../../services/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(Auth);

  protected readonly registerForm =
    this.formBuilder.nonNullable.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      confirmPassword: ['', Validators.required]
    });

  protected errorMessage = '';
  protected successMessage = '';
  protected isSubmitting = false;

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const values = this.registerForm.getRawValue();

    if (values.password !== values.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    this.auth.register({
      username: values.username,
      password: values.password
    }).subscribe({
      next: response => {
        this.isSubmitting = false;
        this.successMessage = response.message;
        this.registerForm.reset();
      },
      error: error => {
        this.isSubmitting = false;

        if (error.status === 409) {
          this.errorMessage =
            'That username is already registered.';
        } else if (error.status === 0) {
          this.errorMessage =
            'Could not reach the API.';
        } else {
          this.errorMessage =
            'Registration failed. Please try again.';
        }
      }
    });
  }
}
