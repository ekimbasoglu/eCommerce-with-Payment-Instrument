import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authService';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  registerObj: any = {
    name: '',
    surname: '',
    email: '',
    password: '',
  };

  ngOnInit(): void {
    if (localStorage.getItem('authToken') !== null) {
      this.router.navigate(['/']);
    }
  }

  onRegister(name: string, surname: string, email: string, password: string) {
    this.authService.register(name, surname, email, password).subscribe(
      (response) => {
        // Handle successful login
        console.log('Registered successful');
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Register failed', error);
        alert('Register failed!');
      }
    );
  }
}
