export interface UserDTO {
  backUserId?: number;
  phone: string;
  name: string;
  surname: string;
  mail?: string;
  registrationDate?: string;
  password: string;
  active?: boolean;
}
