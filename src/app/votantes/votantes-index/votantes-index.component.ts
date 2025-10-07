import { Component } from '@angular/core';
import { MenuComponent } from '../../shared/menu/menu.component';
import { HeaderComponent } from '../../shared/header/header.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-votantes-index',

  imports: [MenuComponent, HeaderComponent, RouterModule],
  templateUrl: './votantes-index.component.html',
  styleUrl: './votantes-index.component.scss'
})
export class VotantesIndexComponent {

}
