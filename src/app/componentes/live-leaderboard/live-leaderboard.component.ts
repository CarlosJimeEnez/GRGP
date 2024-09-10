import { Component, Input, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Player, PlayerDto } from '../../interface/Player';
import { AlertsService } from '../../services/alerts.service';

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
                        <div class="box" [ngStyle]="{'background-color': element.playerColor}"></div>
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
        <!-- <ng-container matColumnDef="demo-penalties">
            <th mat-header-cell *matHeaderCellDef> Penalties </th>
            <td mat-cell *matCellDef="let element"> {{element.penalties}} </td>
            </ng-container> -->
    
    
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
    
</div>
  `,
  styleUrl: './live-leaderboard.component.css'
})
export class LiveLeaderboardComponent implements OnInit {
  constructor(private _alertService: AlertsService){}

  pilotsData: PlayerDto[] = [];

  displayedColumns: string[] = ['demo-position', 'demo-name'];
  dataSource = this.pilotsData

  @Input() color2: string = "#ff914d";
  @Input() color1: string = "#f315c3";
  
  
  ngOnInit(): void {
    this._alertService.dataDetection$.subscribe(value => {
      const dto: PlayerDto[] = value
      this.pilotsData = dto
      this.dataSource = this.pilotsData
    })
  }

  
}
