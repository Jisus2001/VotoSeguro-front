import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PersonasService } from '../../services/personas.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent {
  constructor(public router: Router,     
    public personasService: PersonasService,
) {
      personasService.logout();
      this.getOut();
  }

  getOut(){
    this.router.navigateByUrl("/");
  }
}
