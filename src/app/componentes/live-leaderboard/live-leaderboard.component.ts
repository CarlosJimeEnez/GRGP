import { Component } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
export interface Pilots {
  position: number,
  name: string, 
  gap: string, 
  penalties: number,  
  color: string,
}

const pilotsData: Pilots[] = [
  {position: 1, name: 'Jenny',gap: 'Leader', penalties: 0, color: '#F315C3'},
  {position: 3, name: 'Larry',gap: '', penalties: 0, color: '#F31515'}, 
];

@Component({
  selector: 'app-live-leaderboard',
  standalone: true,
  imports: [MatTableModule, CommonModule],
  template: `
  <div class="card p-3 mb-3 bold">
    <h5 class="card-title p-3 bold">Live Leaderboard</h5>
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
        
       
        <!-- Gap Column -->
        <ng-container matColumnDef="demo-gap">
            <th mat-header-cell *matHeaderCellDef> Gap </th>
            <td mat-cell *matCellDef="let element"> {{element.gap}} </td>
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
export class LiveLeaderboardComponent {
  displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-gap', 'demo-penalties'];
  dataSource = pilotsData
}
