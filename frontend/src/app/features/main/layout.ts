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
            name: 'Grupos',
            route: 'grupos',
            icon: 'groups'
        },
        {
            name: 'Usuarios',
            route: 'usuarios',
            icon: 'person_add'
        }
    ]
}
