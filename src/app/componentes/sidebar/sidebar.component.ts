import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule, RouterModule],
  template: `
    <div class="wrapper">
        <div class="menu">
            <nav>
                <div class="menu-item mt-3">
                    <mat-icon routerLink="/home" routerLinkActive="active">dashboard</mat-icon>
                </div>
                <div  routerLinkActive="active" class="menu-item mt-3">
                    <mat-icon>bar_chart</mat-icon>
                </div>
                <div routerLink="/cars" routerLinkActive="active" class="menu-item mt-3">
                    <mat-icon>warehouse</mat-icon>
                </div>
            </nav>
        </div>
    </div>

  `,
  styles: `
    .wrapper {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .logo {
        display: flex;
        justify-content: center;
        align-items: center;    
    }

    .logo-img {
        max-width: 100%;
        height: auto;
    }
    .menu {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        height: 70vh;
    }
    .menu-item {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--white);
        border-radius: 50%;
        width: 50px;
        height: 50px;
    }
    .menu-item:hover {
        background-color: var(--shadows);
        color: var(--background);
    }
    .active {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--black);    
        color: var(--background);
        border-radius: 50%;
        width: 50px;
        height: 50px;
    }
  `, 
})
export class SidebarComponent {

}
