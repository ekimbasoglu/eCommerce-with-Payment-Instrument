import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/authService';
import { ProductService } from '../services/product.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  providers: [ProductService],
})
export class SearchComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  keyword: string;
  products: any[] = [];
  defaultAmount = 1;

  ngOnInit(): void {
    this.keyword = this.route.snapshot.params['keyword']!;
    this.fetchProducts(this.keyword);
    if (this.keyword === undefined) {
      this.keyword = 'all the results:';
    }
  }

  fetchProducts(keyword: string) {
    this.productService.getAll().subscribe(
      (data) => {
        if (keyword === undefined) {
          this.products = data;
        } else {
          let regexPattern = `^(${keyword})`;
          let regEx = new RegExp(regexPattern);
          this.products = data.filter((product: any) =>
            regEx.test(product.name)
          );
          let test = '';
        }
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  addToCart(productName: string) {
    type User = {
      _id: any;
      name: string;
      email: string;
      surname: string;
      roles: string;
    };
    const user: User = this.authService.getUser();
    this.productService
      .addToCart(productName, user.email, this.defaultAmount)
      .subscribe(
        (response) => {
          alert('Product added to the cart!');
          this.router.navigate(['/dashboard']);
          console.log(this.products);
        },
        (error) => {
          console.error('Error:', error);
          alert('Something went wrong! please login again');
          localStorage.removeItem('authToken');
          this.router.navigate(['/login']);
        }
      );
  }
}
