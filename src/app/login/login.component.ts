import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from '../services/message.service';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private modalService: NgbModal
  ) { }

  returnUrl: string;
  submitted = false;

  @ViewChild('content')
  content: TemplateRef<any>;
 
  user = {firstName: '', lastName: '', username: '', password: ''};

  onSubmit() { 
    this.submitted = true;
    this.authenticationService.login(this.user.username, this.user.password).subscribe(() => {
      this.messageService.add("Login component: Submitted, return url: " + this.returnUrl);
      this.router.navigate([this.returnUrl]);

    });
  }

  ngOnInit() {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.open(this.content);
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});
  }

 
}

