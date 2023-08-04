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

  ngOnInit(): void {
    this.keyword = this.route.snapshot.params['keyword']!;
    if (this.keyword === undefined) {
      this.keyword = 'all the results:';
      this.fetchProducts();
    }
  }

  fetchProducts() {
    this.productService.getAll().subscribe(
      (data) => {
        this.products = data;
        console.log(this.products);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  addToCart(item: string) {
    this.cartItems.push(item);
  }
}
