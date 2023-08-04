import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../model/user.model';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  forgetBefore(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/forgetpassword`, { email });
  }

  private apiUrl = 'https://localhost:3000/product/get'; // API Endpoint
  private authToken: string;

  constructor(private http: HttpClient, private router: Router) {}

  // wout keyword
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  get(keyword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, { keyword }).pipe(
      tap((response: any) => {
        const token = response;
      })
    );
  }
}
