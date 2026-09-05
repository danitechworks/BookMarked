import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Books } from './pages/books/books';
import { authGuard } from './guards/auth-guard';
import { BookForm } from './pages/book-form/book-form';
import { Quotes } from './pages/quotes/quotes';
import { QuoteForm } from './pages/quote-form/quote-form';

export const routes: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'register',
    component: Register
  },
  {
    path: 'books',
    component: Books,
    canActivate: [authGuard]
  },
  {
    path: 'books/new',
    component: BookForm,
    canActivate: [authGuard]
  },
  {
    path: 'books/edit/:id',
    component: BookForm,
    canActivate: [authGuard]
  },
  {
    path: 'quotes',
    component: Quotes,
    canActivate: [authGuard]
  },
  {
    path: 'quotes/new',
    component: QuoteForm,
    canActivate: [authGuard]
  },
  {
    path: 'quotes/edit/:id',
    component: QuoteForm,
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
