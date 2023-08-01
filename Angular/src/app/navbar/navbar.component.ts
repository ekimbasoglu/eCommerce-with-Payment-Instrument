import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  logout() {
    this.authService.logout();
  }
  constructor(private router: Router, private authService: AuthService) {}
  isLoggedIn: boolean = false;

  redirectRegister() {
    this.router.navigate(['/register']);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
}
