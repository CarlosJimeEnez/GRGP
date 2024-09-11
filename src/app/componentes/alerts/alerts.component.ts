import { Component, Input, OnInit } from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { AlertsService } from '../../services/alerts.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [MatBadgeModule, MatIcon, CommonModule],
  template: `
  <div class="card">
    <h5 class="card-title p-3"> Alerts </h5>
    <div class="container">
    
    <div class="alert alert-warning" role="alert">
      <div class="row align-items-center justify-content-start  alert-row">
        <div class="col-1">
          <mat-icon>flag</mat-icon>
        </div>
        <div class="col">
          <h6 class="m-0">Starting</h6>
        </div>
      </div>
    </div>

      @for (alert of alerts; track alert.id) {
        <div class="alert" [ngClass]="getAlertClass(alert.type)" role="alert">
          <div class="row align-items-center justify-content-start  alert-row">
            <div class="col-1">
              <mat-icon>flag</mat-icon>
            </div>
            <div class="col">
              <h6 class="m-0">{{alert.message}}</h6>
            </div>
          </div>
        </div>
      }
    </div>
  </div>
`, 
  
  styleUrl: './alerts.component.css'
})
export class AlertsComponent implements OnInit {
  @Input() alertId!: number
  alerts: any[] = []
  alertCounter: number = 0;
  
  constructor (private alertService: AlertsService){}

  ngOnInit(): void {
    this.alertService.getAlerts().subscribe(value => {
      this.alerts = value
    })
  }

  // Devuelve la clase CSS correspondiente al tipo de alerta
  getAlertClass(type: string): string {
    switch (type) {
      case 'success':
        return 'alert-success';
      case 'warning':
        return 'alert-warning';
      default:
        return 'alert-info';
    }
  }
}
