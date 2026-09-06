import { Component, inject } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar {
  protected menuOpen = false;

  protected toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  protected closeMenu(): void {
    this.menuOpen = false;
  }

  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected get isLoggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  protected logout(): void {
    this.auth.logout();
    this.closeMenu();
    this.router.navigate(['/login']);
  }
}
