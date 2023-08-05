import { Component, OnInit } from '@angular/core';
import { components } from '../common/components';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}
  products: any[] = [];
  totalProducts: number;
  totalPrice: number;
  noProducts: boolean = false;

  ngOnInit(): void {
    this.getBasket();
  }

  getBasket() {
    type User = {
      _id: any;
      name: string;
      email: string;
      surname: string;
      roles: string;
    };
    const user: User = this.authService.getUser();

    this.productService.getBasket(user.email).subscribe(
      (response) => {
        this.noProducts = response.length !== 0 ? true : false;
        this.products = response.products;
        this.totalProducts = this.products.length;
        this.totalPrice = this.products.reduce(
          (acc, product) => acc + product.price,
          0
        );
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  removeBasket() {
    type User = {
      _id: any;
      name: string;
      email: string;
      surname: string;
      roles: string;
    };
    const user: User = this.authService.getUser();

    this.productService.removeBasket(user.email).subscribe(
      (response) => {
        this.router.navigate(['/search/']);
      },
      (error) => {
        console.error('Error:', error);
        alert('Something went wrong! please login again');
        localStorage.removeItem('authToken');
        this.router.navigate(['/login']);
      }
    );
  }

  alert() {
    alert('In Progress');
  }

  components = components.filter((component) => !!component.card);
}
