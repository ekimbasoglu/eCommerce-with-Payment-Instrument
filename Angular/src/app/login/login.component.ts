import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthService],
})
export class LoginComponent {
  loginObj: any = {
    userName: '',
    password: '',
  };
  constructor(private router: Router, private authService: AuthService) {}
  onLogin(email: string, password: string) {
    this.authService.login(email, password).subscribe(
      (response) => {
        // Handle successful login
        console.log('Login successful');
        this.router.navigate(['/']);
      },
      (error) => {
        // Handle login error
        console.error('Login failed', error);
        alert('Wrong credentials!');
        // Display error message or perform other actions upon login failure
      }
    );
  }
}
