import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication-service/authentication.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

class CustomValidators {
  static passwordContainsNumber(control: AbstractControl): ValidationErrors {
    const regex = /\d/;
    if (regex.test(control.value) && control.value !== null) {
      return null;
    } else {
      return { passwordInvalid: true };
    }
  }
  static passwordMatch(control: AbstractControl): ValidationErrors {
    const password = control.get('password').value;
    const passwordConfirm = control.get('passwordConfirm').value;
    if (
      password === passwordConfirm &&
      password !== null &&
      passwordConfirm !== null
    ) {
      return null;
    } else {
      return { passwordNotMatcing: true };
    }
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private authService: AuthenticationService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        name: [null, [Validators.required]],
        username: [null, [Validators.required]],
        email: [
          null,
          [Validators.required, Validators.email, Validators.minLength(6)],
        ],
        password: [
          null,
          [
            Validators.required,
            Validators.minLength(3),
            CustomValidators.passwordContainsNumber,
          ],
        ],
        passwordConfirm: [null, [Validators.required]],
      },
      {
        validators: CustomValidators.passwordMatch,
      }
    );
  }

  get email() {
    return this.registerForm.get('email');
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    console.log(this.registerForm.value);
    this.authService
      .register(this.registerForm.value)
      .pipe(map((user) => this.router.navigate(['login'])))
      .subscribe();
  }
}
