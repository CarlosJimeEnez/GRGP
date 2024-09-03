import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
export interface Pilots {
  position: number,
  name: string, 
  team: string, 
  gap: string, 
  penalties: number, 
  status: string, 
  color: string,
}

const pilotsData: Pilots[] = [
  {position: 1, name: 'Jenny', team: "unknow", gap: 'Leader', penalties: 0, status: '', color: '#F315C3'},
  {position: 3, name: 'Larry', team: "unknow", gap: '', penalties: 0, status: '', color: '#F31515'}, 
];

@Component({
  selector: 'app-live-leaderboard',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  templateUrl: './live-leaderboard.component.html',
  styleUrl: './live-leaderboard.component.css'
})
export class LiveLeaderboardComponent {
  displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-team', 'demo-gap', 'demo-penalties', "demo-status"];
  dataSource = pilotsData
}
