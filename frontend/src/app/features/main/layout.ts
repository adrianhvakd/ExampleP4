import { Component } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.html',
    imports: [RouterOutlet, RouterLink]
})
export class LayoutComponent {
    menuNav = [
        {
            name: 'Dashboard',
            route: 'dashboard',
            icon: 'dashboard'
        },
        {
            name: 'Jardin',
            route: 'jardin',
            icon: 'forest'
        },
        {
            name: 'Perfil',
            route: 'perfil',
            icon: 'person'
        }
    ]

}