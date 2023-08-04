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

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  // pseudo
  // Redirect to the search page with query

  // if => empty => Redirect to search page which will show all the products
  // if => (keyword) => Redirect to the search page => will show based on Mongoose search

  // First do the step 1
  search(keyword: string) {
    this.router.navigate(['/search', keyword]);
  }
}
