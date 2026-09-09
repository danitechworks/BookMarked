import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

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
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6)
        ]
      ],
      confirmPassword: [
        '',
        Validators.required
      ]
    });

  protected errorMessage = '';
  protected successMessage = '';
  protected isSubmitting = false;

  protected onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const values = this.registerForm.getRawValue();

    if (values.password !== values.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

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

        if (error.status === 429) {
          this.errorMessage =
            'Too many attempts. Please wait one minute and try again.';
          return;
        }

        const apiMessage = error.error?.message;
        const validationErrors = error.error?.errors;

        if (typeof apiMessage === 'string') {
          this.errorMessage = apiMessage;
        } else if (validationErrors) {
          this.errorMessage = Object
            .values(validationErrors)
            .flat()
            .join(' ');
        } else if (error.status === 0) {
          this.errorMessage =
            'Could not reach the API. Please check your connection.';
        } else if (error.status >= 500) {
          this.errorMessage =
            'The server is temporarily unavailable. Please wait and try again.';
        } else {
          this.errorMessage =
            'Registration failed. Please check your information.';
        }
      }
    });
  }
}
