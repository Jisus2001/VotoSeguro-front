import { Component } from '@angular/core';
import { MenuComponent } from "../../shared/menu/menu.component";
import { HeaderComponent } from "../../shared/header/header.component";

@Component({
  selector: 'app-ayuda',
  standalone: true,
  imports: [MenuComponent, HeaderComponent],
  templateUrl: './ayuda.component.html',
  styleUrl: './ayuda.component.scss'
})
export class AyudaComponent {

}
