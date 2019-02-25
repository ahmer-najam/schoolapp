import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './services/authentication.service';
import { MessageService } from './services/message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
constructor(
  private authenticationService: AuthenticationService,
  private router: Router,
  private messageService: MessageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.messageService.add("canActivate()");
    const currentUser = this.authenticationService.user;
    if (currentUser) {
        if (route.data.roles && route.data.roles.indexOf(currentUser.role) === -1) {
            this.router.navigate(['/']);
            return false;
        }

        return true;
    }
    this.messageService.add("Router navigated to /login in auth guard");
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
}
}
