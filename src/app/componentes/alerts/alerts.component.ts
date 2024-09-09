import { Component, Input, OnInit } from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [MatBadgeModule, MatIcon],
  template: `
  <div class="card">
    <h5 class="card-title p-3"> Alerts </h5>
    <div class="container">
      <div class="row align-items-center m-1">
        <div class="alert alert-info d-flex align-items-center" role="alert">
          The race began
        </div>
      </div>
      @for (alert of _alerts; track alert.id) {
        <div class="alert alert-warning d-flex align-items-center" role="alert">
        <mat-icon>flag</mat-icon>  
        <div>
            Crash Detection
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
  _alert: any = {
    id:0,
    val: false
  }
  _alertCounter: number = 0;
  _alerts: any[] = []
  constructor (private alertService: AlertsService){}

  ngOnInit(): void {
   this.alertService.crashDetection$.subscribe(value => {
    if(value == true){
      this._alert.val = value
      this._alert.id = this.getNextAlertId()
      this._alerts.push({ ...this._alert})
    }
    console.log(this._alert)
   })
  }

  getNextAlertId(): number {
    return ++this._alertCounter
  }
}
