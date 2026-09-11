import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule, 
  Validators
} from '@angular/forms';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loginForm =
    this.formBuilder.nonNullable.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

  protected errorMessage = '';
  protected successMessage =
    this.route.snapshot.queryParamMap.get('sessionExpired') === 'true'
      ? 'Your session expired. Please log in again.'
      : '';
  protected isSubmitting = false;

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;

    const request = this.loginForm.getRawValue();

    this.auth.login(request).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
      },
      error: error => {
        this.isSubmitting = false;

        if (error.status === 401) {
          this.errorMessage =
            'Invalid username or password.';
        } else if (error.status === 0) {
          this.errorMessage =
            'Could not reach the API.';
        } else if (error.status === 429) {
          this.errorMessage =
            'Too many attempts. Please wait one minute and try again.';
        } else {
          this.errorMessage =
            'Something went wrong. Please try again.';
        }
      }

    });
  }

}
