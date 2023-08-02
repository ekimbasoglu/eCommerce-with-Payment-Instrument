import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PasswordResetService } from '../services/password-reset.service';

@Component({
  selector: 'app-forgetpasswordafter',
  templateUrl: './forgetpasswordafter.component.html',
  styleUrls: ['./forgetpasswordafter.component.css'],
})
export class ForgetpasswordafterComponent {
  token: string;
  newPassword: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token')!;

    if (this.route.snapshot.queryParamMap.get('token') === null) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(newPassword: string) {
    this.passwordResetService.resetPassword(this.token, newPassword).subscribe(
      (response) => {
        console.log('Password reset successful');
        alert('Password updated successfully! Please sign in again!');
        this.router.navigate(['/login']);
      },
      (error) => {
        alert('Token has expired!');
        this.router.navigate(['/forgetpassword']);
      }
    );
  }
}
