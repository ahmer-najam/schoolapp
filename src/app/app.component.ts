import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';
import { MessageService } from './services/message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  
  isNavbarCollapsed = true;

  constructor(private userService: UserService,
    public authenticationService: AuthenticationService,
    private messageService: MessageService
    ) { 
      if(JSON.parse(localStorage.getItem('currentUser')) == null) {
        this.messageService.add("Current user: null")
      }
      else {
        this.messageService.add("Current user: " + JSON.parse(localStorage.getItem('currentUser')).firstName);
        this.messageService.add("Auth service user: " + this.authenticationService.user.firstName);
      }
      
    }

  adminCheck(): boolean {
    if(this.authenticationService.user && this.authenticationService.user.role == 'Admin')
      return true;
    return false;
  }

  anyUserCheck(): boolean {
    if(this.authenticationService.user)
      return true;
    return false;
  }


  
}
