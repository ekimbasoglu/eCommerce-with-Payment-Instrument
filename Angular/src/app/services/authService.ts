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
export class AuthService {
  private apiUrl = 'http://localhost:3000'; // API Endpoint
  private authToken: string;

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/user/login`, { email, password })
      .pipe(
        tap((response: any) => {
          const token = response.token;
          this.cacheToken(token);
          this.convertTokenToUserModel(token);
        })
      );
  }

  private cacheToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.authToken = token;
  }

  private convertTokenToUserModel(token: string): void {
    // Assuming you have a User model class
    // and a method to convert the token to a user model
    const user = this.convertTokenToUser(token);
    // Do something with the user model, such as store it in a service or component
  }

  private convertTokenToUser(token: string): any {
    const decodedToken: any = this.decodeJwtToken(token);
    const user: User = new User(
      decodedToken.user._id,
      decodedToken.user.name,
      decodedToken.user.email,
      decodedToken.user.password,
      decodedToken.user.surname,
      decodedToken.user.roles
    );
    return user;
  }

  // Decode the JWT token
  private decodeJwtToken(token: string): any {
    try {
      const decodedToken = jwt_decode(token);

      return decodedToken;
    } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('authToken') === null ? false : true;
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.authToken = '';
    this.router.navigate(['/']);
  }

  register(
    name: string,
    surname: string,
    email: string,
    password: string
  ): Observable<any> {
    const body = { name, surname, email, password };

    return this.http
      .post(
        `${this.apiUrl}/user/register`,
        { name, surname, email, password },
        { responseType: 'text' }
      )
      .pipe(
        tap((response: any) => {
          alert('User successfully created!');
          this.router.navigate(['/login']);
        })
      );
  }
}
