import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-forgetpassword',
  templateUrl: './forgetpassword.component.html',
  styleUrls: ['./forgetpassword.component.css'],
})
export class ForgetpasswordComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  forgetObj: any = {
    email: '',
  };

  onForget(email: string) {
    this.authService.forgetBefore(email).subscribe(
      (response) => {
        // Handle successful login
        console.log('Email sent successfully!');
        alert(
          'Email sent successfully! You can reset your password from the link!'
        );
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

  ngOnInit(): void {
    if (localStorage.getItem('authToken') !== null) {
      this.router.navigate(['/']);
    }
  }
}
