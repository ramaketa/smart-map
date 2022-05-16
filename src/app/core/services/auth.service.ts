import { Injectable } from '@angular/core';
import { User } from "../models/user.model";
import { Router } from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UserDTO} from "../models/userDTO";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user!: User;
  userDTO!: UserDTO;

  constructor(private router: Router,
              private httpClient: HttpClient) {
    const ndviUser: string | null = localStorage.getItem('ndviUser');
    const authorization: string | null = localStorage.getItem('authorization');
    if (authorization) {
      this.user = new User(JSON.parse(authorization))
    }
    if (ndviUser) {
      this.userDTO = JSON.parse(ndviUser)
    }
  }

  login(userDTO: UserDTO, user: User): void {
    this.user = new User(user);
    if (this.user.btoa != null) {
      localStorage.setItem('authorization', JSON.stringify(user));
    }
    localStorage.setItem('ndviUser', JSON.stringify(userDTO));

    this.userDTO = userDTO;
    this.router.navigate(['/account'])
  }

  checkUserExist(user: User): Observable<UserDTO> {
    return this.httpClient.get<UserDTO>(`/ndvi/user/login/${user.phone}`);
  }

  logout(): void {
    // @ts-ignore
    this.user = undefined;
    localStorage.removeItem('authorization');
    localStorage.removeItem('ndviUser');

    window.location.reload();
  }

  isAuthenticated(): boolean {
    return !!this.user?.btoa;
  }

  getBasicAuthAuthorization(): string {
    return !!this.user?.btoa ? this.user.btoa : '';
  }

  register(user: UserDTO): Observable<number> {
    return this.httpClient.post<number>(`/ndvi/user/signup`, user);
  }


}
