import { Routes } from '@angular/router';
import { DeclarationsComponent } from './routes/admin/declarations/declarations.component';
import { AddressComponent } from './routes/requester/declaration/address/address.component';
import { ClientsComponent } from './routes/admin/clients/clients.component';
import { RequestsComponent } from './routes/admin/requests/requests.component';
import { AuthGuard } from './core/providers/auth.guard';
import { SuccessComponent } from './routes/auth/register/success/success.component';
import { PageNotFoundComponent } from './routes/page-not-found/page-not-found.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { MyOrdersComponent } from './routes/requester/my-orders/my-orders.component';
import { PublicLayoutComponent } from './core/layout/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './core/layout/private-layout/private-layout.component';
import { RequesterGuard } from './core/providers/requester.guard';
import { AdminGuard } from './core/providers/admin.guard';
import { CompletedDeclarationsComponent } from './routes/admin/completed-declarations/completed-declarations.component';
import { UserUpdateComponent } from './routes/requester/user-update/user-update.component';
import { ProfileComponent } from './routes/requester/profile/profile.component';
import { SummaryComponent } from './routes/admin/requests/summary/summary.component';
import { DeclarationEditComponent } from './routes/admin/declarations/declaration-edit/declaration-edit.component';
import { DeclarationCreateComponent } from './routes/admin/declarations/declaration-create/declaration-create.component';
import { UsersComponent } from './routes/admin/users/users.component';
import { ForgotPasswordComponent } from './routes/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './routes/auth/reset-password/reset-password.component';
import { DashboardComponent } from './routes/admin/dashboard/dashboard.component';
import { UserRegistrationComponent } from './routes/admin/user-registration/user-registration.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'my-orders',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, title: 'Login' },
      {
        path: 'register',
        component: RegisterComponent,
        title: 'Criar conta',
      },
      { path: 'success', component: SuccessComponent },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'Esqueceu senha',
      },
      {
        path: 'reset-password',
        component: ResetPasswordComponent,
        title: 'Recuperar senha',
      },
    ],
  },
  {
    path: '',
    component: PrivateLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'my-orders',
        component: MyOrdersComponent,
        title: 'Minhas solicitações',
        canActivate: [RequesterGuard],
      },
      {
        path: 'requests',
        title: 'Solicitações',
        canActivate: [AdminGuard],
        children: [
          {
            path: '',
            component: RequestsComponent,
            title: 'Gestão de solicitações',
          },

          {
            path: 'summary',
            component: SummaryComponent,
            title: 'Declarações geradas',
          },
        ],
      },
      {
        path: 'management',
        title: 'Gerenciamento de usuários',
        canActivate: [AdminGuard],
        children: [

          {
            path: 'create-acount',
            component: UserRegistrationComponent,
            title: 'Cadastrar usuário',
          },
          
          {
            path: 'search',
            component: UsersComponent,
            title: 'Usuários',
            canActivate: [AdminGuard],
          },
        ]
      },
      {
        path: 'completed-declarations',
        component: CompletedDeclarationsComponent,
        title: 'Declarações geradas',
        canActivate: [AdminGuard],
      },
      {
        path: 'profile',
        title: 'Meu perfil',
        canActivate: [RequesterGuard],
        children: [
          {
            path: '',
            component: ProfileComponent,
            title: 'Meu Perfil',
          },
          {
            path: 'update',
            component: UserUpdateComponent,
            title: 'Atualizar meus dados',
          },
        ],
      },
      {
        path: 'declarations',
        title: 'Declarações',
        canActivate: [AdminGuard],
        children: [
          {
            path: '',
            component: DeclarationsComponent,
            title: 'Declarações cadastradas',
          },
          {
            path: 'create',
            component: DeclarationCreateComponent,
            title: 'Criar declaração',
          },
          {
            path: ':id/edit',
            component: DeclarationEditComponent,
            title: 'Editar declaração',
          },
        ],
      },

      {
        path: 'dashboard',
        component: DashboardComponent,
        title: 'Relatório',
        canActivate: [AdminGuard],
      },

      // {
      //   path: 'declarations',
      //   component: DeclarationsComponent,
      //   title: 'Declarações',
      // },
      // {
      //   path: 'address',
      //   component: AddressComponent,
      //   title: 'Endereço',
      // },
      // {
      //   path: 'clients',
      //   component: ClientsComponent,
      //   title: 'Clientes',
      // },
      // {
      //   path: 'other-declarations',
      //   component: OtherDeclarationsComponent,
      //   title: 'Outras Declarações',
      // },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];
