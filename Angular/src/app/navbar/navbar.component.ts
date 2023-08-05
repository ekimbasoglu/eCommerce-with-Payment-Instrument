import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}

  keyword: string;
  isLoggedIn: boolean = false;

  logout() {
    this.authService.logout();
  }

  redirectRegister() {
    this.router.navigate(['/register']);
  }

  redirectDashboard() {
    this.router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
  search(keyword: string) {
    this.router.navigate(['/search', keyword]);
  }
}
