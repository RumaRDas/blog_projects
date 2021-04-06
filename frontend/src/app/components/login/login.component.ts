import { AuthenticationService } from './../../services/authentication.service';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthenticationService) {}

  ngOnInit(): void {}

  login() {
    this.authService.login('tony@gmail.com', '123456').subscribe((data) => {
      console.log('SUCCESS');
    });
  }
}
