import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PasswordResetService {
  constructor(private http: HttpClient) {}

  resetPassword(token: string, newPassword: string) {
    const url = `http://localhost:3000/user/forgetpassword/${token}`;
    const body = { newPassword };

    return this.http.post(url, body);
  }
}
