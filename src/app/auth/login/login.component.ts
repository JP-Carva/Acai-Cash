import { AppFloatingConfigurator } from "@/layout/component/app.floatingconfigurator";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { InputTextModule } from "primeng/inputtext";
import { PasswordModule } from "primeng/password";
import { RippleModule } from "primeng/ripple";
import { AuthService } from "../services/auth.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

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
    RippleModule,
    AppFloatingConfigurator,
    ToastModule
],
  providers: [MessageService]
})
export class LoginComponent {
    email?: string;
    password?: string;

    checked: boolean = false;

    authService = inject(AuthService);
    messageService = inject(MessageService);
    router = inject(Router);

    onSubmit(){
      if(this.email && this.password) {
        this.authService.login(this.email, this.password)
        .subscribe({
            next: () => this.router.navigate(['/']),
            error: () => this.messageService.add({
              severity:'error', 
              summary: 'Falha na autenticação', 
              detail: 'Usuário e/ou senha inválido(s)'
            })
        });
      }
      if(!this.email && !this.password){
      this.messageService.add({
        severity:'error', 
        summary: 'Informe usuário e senha', 
        detail: 'Usuário e/ou senha inválido(s)'});
      }

    }

}