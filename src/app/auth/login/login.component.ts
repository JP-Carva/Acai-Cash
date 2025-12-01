import { AppFloatingConfigurator } from "@/layout/component/app.floatingconfigurator";
import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
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
import { CardModule } from "primeng/card";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "app-login",
  standalone: true,
  templateUrl: "./login.component.html",
  imports: [
    CommonModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    RippleModule,
    AppFloatingConfigurator,
    ToastModule,
    CardModule,
    DialogModule
],
})
export class LoginComponent {
    login?: string;
    password?: string;

    checked: boolean = false;
    submitted = false;

    authService = inject(AuthService);
    messageService = inject(MessageService);
    router = inject(Router);

    onSubmit(){
      this.submitted = true;
      if(this.login && this.password) {
        this.authService.login(this.login, this.password)
        .subscribe({
            next: () => {
              this.messageService.add({ severity:'success', summary:'Bem-vindo', detail:'Login efetuado com sucesso' });
              this.router.navigate(['/dashboard']);
            },
            error: () => this.messageService.add({
              severity:'error', 
              summary: 'Falha na autenticação', 
              detail: 'Usuário e/ou senha inválido(s)'
            })
        });
      }
      if(!this.login && !this.password || !this.login || !this.password){
      this.messageService.add({
        severity:'error', 
        summary: 'Informe usuário e senha', 
        detail: 'Usuário e/ou senha inválido(s)'});
      }

    }

}