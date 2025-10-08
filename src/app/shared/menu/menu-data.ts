// menu-data.ts
export interface NavItem {
  displayName: string;
  iconPath: string;
  validation: string;
  route: string;
}
//Menu para el administrador
//Votante tendrá un boton para votar y validar su voto

export const navItems: NavItem[] = [
  {
    displayName: 'Dashboard',
    iconPath: '../../../assets/menu-items/panel.png',
    validation: "isAutenticated",
    route: '/dashboard',
  },
  {
    displayName: 'Votantes',
    iconPath: '../../../assets/menu-items/votante.png',
    validation: "isAutenticated",
    route: '/votantes',
  },
  {
    displayName: 'Elecciones',
    iconPath: '../../../assets/menu-items/eleccion.png',
    validation: "isAutenticated",
    route: '/elecciones',
  },
  {
    displayName: 'Reportes',
    iconPath: '../../../assets/menu-items/reporte-de-negocios.png',
    validation: "isAutenticated",
    route: '/reportes',
  },
  {
    displayName: 'Ajustes',
    iconPath: '../../../assets/menu-items/ajustes.png',
    validation: "isAutenticated",
    route: '/ajustes',
  },
  {
    displayName: 'Cerrar Sesión',
    iconPath: './../../assets/menu-items/cerrar-sesion.png',
    validation: "isAutenticated",
    route: '/logout',
  },
];
