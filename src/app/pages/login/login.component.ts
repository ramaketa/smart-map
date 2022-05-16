import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from "../../core/services/auth.service";
import {UtilsService} from "../../core/services/utils.service";
import {User} from "../../core/models/user.model";
import {UserDTO} from "../../core/models/userDTO";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private utilsService: UtilsService,
    private router: Router,
  ) {
  }

  login(user: User): void {
    this.authService.checkUserExist(user).subscribe(
      ((data: UserDTO) => {
        if (data.backUserId && data.active) {
          this.authService.login(data, user);
        }
      }),
      ((error: any) => console.log('err', error))
    );
  }

  submitForm(): void {
    // tslint:disable-next-line:forin
    for (const i in this.authForm.controls) {
      this.authForm.controls[i].markAsDirty();
      this.authForm.controls[i].updateValueAndValidity();
    }
    if (this.authForm.valid) {
      const user = {
        phone: this.authForm.get('phone')?.value,
        password: this.authForm.get('password')?.value
      }
      this.login(user);
    }
  }

  ngOnInit(): void {
    this.authForm = this.fb.group({
      phone: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account']);
    }
  }

}
