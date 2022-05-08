export class User {
  phone: string;
  password: string;

  btoa?: string;

  constructor(user: { phone: string; password: string }) {
    this.phone = user.phone;
    this.password = user.password;

    if (this.phone && this.password) {
      this.btoa = btoa(`${user.phone}:${user.password}`);
    }
  }
}
