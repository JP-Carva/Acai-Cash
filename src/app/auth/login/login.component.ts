import { AppFloatingConfigurator } from "@/layout/component/app.floatingconfigurator";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { RippleModule } from "primeng/ripple";

@Component({
  selector: "app-login",
  standalone: true,
  templateUrl: "./login.component.html",
  imports: [
    ButtonModule,
    CheckboxModule, 
    InputTextModule, 
    PasswordModule, 
    FormsModule, 
    RouterModule, 
    RippleModule, 
    AppFloatingConfigurator
  ],
})
export class LoginComponent {
    email: string = '';

    password: string = '';

    checked: boolean = false;
}