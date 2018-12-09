import { Component, OnInit, NgZone } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router' 
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm
  registerForm
  registerFocus
  loginFocus
  validationErrors
  disableButtons
  constructor(
    private loginService: LoginService,
    private cookieService: CookieService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.loginFocus = true
    this.validationErrors = []
    this.disableButtons = false
    this.loginForm = new FormGroup({
      username: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_]*$"),
        Validators.minLength(5),
        Validators.maxLength(32)
      ])),
      password: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_]*$"),
        Validators.minLength(5),
        Validators.maxLength(32),
      ]))
    });

    this.registerForm = new FormGroup({
      username: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_]*$"),
        Validators.minLength(5),
        Validators.maxLength(32)
      ])),
      password: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_]*$"),
        Validators.minLength(5),
        Validators.maxLength(32),
      ])),
      confirmPassword: new FormControl("", Validators.compose([
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9_]*$"),
        Validators.minLength(5),
        Validators.maxLength(32),
      ]))
    });
  }

  login(formFields) {
    this.disableButtons = true
    this.handleLoginResponse(
      this.loginService
        .login(formFields.username, formFields.password)
    )
  }

  register(formFields) {
    this.disableButtons = true
    this.validationErrors = this.registerErrors(formFields.password, formFields.confirmPassword) 

    if (this.validationErrors.length === 0)
      this.handleLoginResponse(
        this.loginService
          .register(formFields.username, formFields.password)
      )
  }

  registerErrors(pw, confirmPw) {
    return pw !== confirmPw ? ['Slaptažodžiai nesutampa'] : []
  }

  handleLoginResponse(observableResponse: Observable<any>) {
    observableResponse
    .subscribe(
      okResponse => {
        console.log(okResponse)
        this.cookieService.set('authJWT', okResponse.token)
        this.router.navigateByUrl('/')
        this.loginService.successfulLogin()
        this.disableButtons = false
      },
      errorResponse => {
        console.log(errorResponse)
        const errMsg = errorResponse.error.error
        this.validationErrors = [ errMsg ]
        this.disableButtons = false
      }
    )
  }

  changeFocusTo(changeTo: 'register' | 'login') {
    this.validationErrors = []
    this.loginFocus = changeTo === 'login'
  }

}