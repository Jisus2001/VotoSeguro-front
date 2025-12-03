import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PersonasService } from '../../services/personas.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  user: any = null;


  constructor(public personasService: PersonasService) {}

  ngOnInit() {

    this.personasService.decodeToken.subscribe((user: any) => {
      this.user = user;
    });

    if (!this.user) {
      const token = this.personasService.getToken();
    }
  }
}
