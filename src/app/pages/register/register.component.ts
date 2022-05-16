import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UtilsService } from "../../core/services/utils.service";
import { AuthService } from "../../core/services/auth.service";
import { UserDTO } from "../../core/models/userDTO";
import { User } from "../../core/models/user.model";
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLoading!: boolean;
  registerForm!: FormGroup;

  constructor(private fb: FormBuilder,
              private router: Router,
              private authService: AuthService,
              private utilsService: UtilsService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      phone: [null, [Validators.required]],
      name: [null, [Validators.required]],
      surname: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });

    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/account']);
    }
  }

  submitForm(): void {
    if (this.registerForm.invalid) {
      this.utilsService.warningMessage('Необходимо заполнить обязательные поля', 'Ошибка заполнения');
      return;
    }

    this.isLoading = true;
    const userDTO: UserDTO = {
      phone: this.registerForm.get('phone')?.value,
      name: this.registerForm.get('name')?.value,
      surname: this.registerForm.get('surname')?.value,
      password: this.registerForm.get('password')?.value,
    }

    const user: User = new User({
      // @ts-ignore
      phone: userDTO.phone,
      // @ts-ignore
      password: userDTO.password,
    })
    this.authService.register(userDTO).subscribe(
      (data) => {
          this.authService.login(userDTO, user)
      },
      () => {
        this.utilsService.errorMessage();
      }
    ).add(() => this.isLoading = false)
  }

}
