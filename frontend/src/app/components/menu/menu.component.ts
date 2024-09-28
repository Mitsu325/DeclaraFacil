import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../shared/components/header/header.component';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatExpansionModule,
    MatIconModule,
    HeaderComponent,
  ],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  isAdmin: boolean = false;
  currentOpenItem: string | null = null; // Variável para controlar qual painel está aberto

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.isAdmin = this.authService.isAdmin();
    this.checkCurrentRoute();
  }

  toggleMenu(menuItem: string | null): void {
    // Abre o painel clicado e fecha os outros
    if (this.currentOpenItem === menuItem) {
      this.currentOpenItem = null; // Fecha se o painel já estiver aberto
    } else {
      this.currentOpenItem = menuItem; // Abre o painel clicado
    }
  }

  checkCurrentRoute(): void {
    const currentRoute = this.router.url;

    // Define o menu aberto com base na rota atual
    if (currentRoute.includes('/address')) {
      this.currentOpenItem = 'declaracoes';
    } else if (
      currentRoute.includes('/clients') ||
      currentRoute.includes('/users')
    ) {
      this.currentOpenItem = 'administracao';
    } else {
      this.currentOpenItem = null;
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']); // Redireciona para a página de login após logout
  }
}
