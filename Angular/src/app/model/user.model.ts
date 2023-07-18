export class User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  roles: string;

  constructor(
    _id: string,
    name: string,
    email: string,
    password: string,
    surname: string,
    roles: string
  ) {
    this._id = _id;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.password = password;
    this.roles = roles;
  }
}
