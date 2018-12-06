import { Component, OnInit, ElementRef, Renderer2, Input } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup, FormControl, Validators } from '@angular/forms'

const hasClassActive = (selector: string): boolean => {
  return document.querySelector(selector).className === 'active'
}

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
  constructor(private loginService: LoginService) { }

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
    // this.disableButtons = true
    this.loginService
      .login(formFields.username, formFields.password)
      .subscribe(
        x => {
          this.disableButtons = false
          console.log(x)
          console.log("XXXXXXXXXXXXXXXXXXXx")
        },
        error => {
          this.disableButtons = false
          console.log(error)
        }
      )
      // .catch(c => console.log("CCCCCCCCCCCCCCCCCCCC"))
  }

  registerErrors(pw, confirmPw) {
    return pw !== confirmPw ? ['Slaptažodžiai nesutampa'] : []
  }

  register(formFields) {
    // this.disableButtons = true
    this.validationErrors = this.registerErrors(formFields.password, formFields.confirmPassword) 

    if (this.validationErrors.length === 0)
      this.loginService
        .register(formFields.username, formFields.password)
        .subscribe(x => {
          this.disableButtons = false
          console.log('dasdasdasdasdasdasd')
          console.log(x)
        })
  }

  changeFocusTo(changeTo: 'register' | 'login') {
    this.loginFocus = changeTo === 'login'
  }

}