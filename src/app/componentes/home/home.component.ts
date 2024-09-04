import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { HeaderComponent } from '../header/header.component';
import { LiveMapComponent } from "../live-map/live-map.component";
import { LiveStatisticsComponent } from "../live-statistics/live-statistics.component";
import { AlertsComponent } from "../alerts/alerts.component";
import { LiveLeaderboardComponent } from "../../componentes/live-leaderboard/live-leaderboard.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, LiveMapComponent, LiveStatisticsComponent, AlertsComponent, LiveLeaderboardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  srcVideoCrash = "videos/F31515.mp4"
  srcVideo = "videos/ZoneOfControl.mp4"
  mapCrash = 1
}
