import { Component, Input, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
export interface Pilots {
  position: number,
  name: string, 
  penalties: number,  
  color: string,
}

@Component({
  selector: 'app-live-leaderboard',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  template: `
  <div class="card p-1  bold">
    <h5 class="card-title p-3 pb-0 mb-0 bold">Live Leaderboard</h5>
    <table mat-table [dataSource]="dataSource" class="demo-table">
        <!-- Position Column -->
        <ng-container matColumnDef="demo-position">
            <th mat-header-cell *matHeaderCellDef> No. </th>
            <td mat-cell *matCellDef="let element">
                <div class="row m-0 p-0 justify-content-center">
                    <div class="col-3 m-0 p-0">
                        <div class="box" [ngStyle]="{'background-color': element.color}"></div>
                    </div>
                    <div class="col-2 ms-1 p-0 text-start">
                        {{element.position}}
                    </div>
                </div>
            </td>
        </ng-container>
        
        <!-- Name Column -->
        <ng-container matColumnDef="demo-name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
        </ng-container>
        
        <!-- Penalties Column -->
        <ng-container matColumnDef="demo-penalties">
            <th mat-header-cell *matHeaderCellDef> Penalties </th>
            <td mat-cell *matCellDef="let element"> {{element.penalties}} </td>
            </ng-container>
    
    
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
    
</div>
  `,
  styleUrl: './live-leaderboard.component.css'
})
export class LiveLeaderboardComponent implements OnInit {
  pilotsData: Pilots[] = [
    {position: 1, name: 'Jenny', penalties: 0, color: '#f315c3',},
    {position: 3, name: 'Larry', penalties: 0, color: "#ff914d",}, 
  ];

  displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-penalties'];
  dataSource = this.pilotsData

  @Input() color2: string = "#ff914d";
  @Input() color1: string = "#f315c3";
  
  
  ngOnInit(): void {
    this.pilotsData = [
      {position: 1, name: 'Jenny', penalties: 0, color: this.color1,},
      {position: 3, name: 'Larry', penalties: 0, color: this.color2}, 
    ];
    this.dataSource = this.pilotsData
  }

  
}
