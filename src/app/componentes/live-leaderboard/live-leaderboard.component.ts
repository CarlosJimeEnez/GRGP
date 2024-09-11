import { Component, Input, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { Player, PlayerDto } from '../../interface/Player';
import { AlertsService } from '../../services/alerts.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-live-leaderboard',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatIcon],
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
        
        <!-- Actions Column -->
        <ng-container matColumnDef="demo-actions">
          <th mat-header-cell *matHeaderCellDef> Actions </th>
          <td mat-cell *matCellDef="let element">
            <div class="row justify-content-start">
              <div class="col-6">
                <button
                  type="button" class="btn btn-warning center" 
                  data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                  (click)="collision(element)">

                    <mat-icon class="yellowFlag m-0">flag</mat-icon>
                    <p class="mx-2 my-0">example of a collision</p>
                
                  </button>
              </div>
            </div>          
          </td>
        </ng-container>
    
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
    </table>
    
    <!-- Modal -->
    <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="staticBackdropLabel">Yellow Flag</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary">Understood</button>
        </div>
      </div>
    </div>
    </div>
</div>
  `,
  styleUrl: './live-leaderboard.component.css'
})
export class LiveLeaderboardComponent implements OnInit {
  constructor(private _alertService: AlertsService){}

  pilotsData: PlayerDto[] = [];

  displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-actions'];
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

  collision(element: any) {
    console.log("collision detected")
    this._alertService.changeElement(element)
  }

  
}
