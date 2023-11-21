import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/**
 * Service that implements the CanActivate interface to provide route guarding functionality.
 * It checks if the user is authenticated before allowing access to a route.
 */
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Determines if the user is allowed to activate the route.
   * @param route - The activated route snapshot.
   * @param state - The router state snapshot.
   * @returns An Observable, Promise, boolean, or UrlTree indicating if the user is allowed to activate the route.
   *          If the user is not authenticated, it redirects to the landing page.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<boolean | UrlTree> |
    Promise<boolean | UrlTree> |
    boolean | UrlTree { // RouterStateSnapshot returns: Observable, Promise, boolean, or UrlTree, very versatile
    return this.authService.user.pipe(
      take(1),
      map(user => {
        const isAuth = !!user;
        if (isAuth) {
          return true;
        }
        return this.router.createUrlTree(['/landing-page']);
      })
    );
  }
}
