import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { User } from '../../../shared/domain/users.type';
import { NgToastService } from 'ng-angular-popup';
import { UsersService } from '../../../shared/services/api/users.service';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, DatePipe, FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  dataSource: User[] = [];
  displayedColumns: string[] = ['name', 'email', 'cpf', 'createdAt'];
  filter: string = '';
  private filterSubject = new Subject<string>();

  toast = inject(NgToastService);

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.getUsers();

    this.filterSubject
      .pipe(
        debounceTime(500),
        switchMap((filter) => this.usersService.searchUsers(filter))
      )
      .subscribe({
        next: (data) => {
          this.dataSource = data;
        },
        error: () => {
          this.toast.danger(
            'Tente novamente',
            'Falha ao carregar os usuários cadastrados',
            5000
          );
        },
      });
  }

  getUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.dataSource = data;
      },
      error: () => {
        this.toast.danger(
          'Tente novamente',
          'Falha ao carregar os usuários cadastrados',
          5000
        );
      },
    });
  }

  onSearchChange() {
    this.filterSubject.next(this.filter);
  }
}
