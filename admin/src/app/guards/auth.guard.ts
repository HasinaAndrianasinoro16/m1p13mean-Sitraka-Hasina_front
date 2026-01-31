import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role === 'ADMIN') {
      return true;
    }

    alert('Accès refusé. Veuillez vous connecter.');
    this.router.navigate(['/login']);
    return false;
  }
}
