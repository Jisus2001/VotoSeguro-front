import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { PersonasService } from '../services/personas.service';
import { MenuComponent } from '../shared/menu/menu.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss'],
  imports: [RouterModule, MenuComponent, HeaderComponent],
})
export class DashboardComponent implements OnInit {
  user: any = null;

  constructor(private router: Router, public personasService: PersonasService) {}
  nombre: string = '';
  rol: string = '';

  ngOnInit() {
 
    this.personasService.decodeToken.subscribe((user: any) => {
      this.user = user;
    });
    
    if(!this.user){
      const token = this.personasService.getToken();
    }

  }

  logout(): void {
    this.personasService.logout();
    this.router.navigate(['/']);
  }
}
