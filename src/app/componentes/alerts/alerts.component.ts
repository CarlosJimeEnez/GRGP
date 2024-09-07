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
        <div class="alert alert-info" role="alert">
          A simple info alert—check it out!
        </div>
      </div>
    </div>
  </div>
`, 
  styleUrl: './alerts.component.css'
})
export class AlertsComponent implements OnInit {
  @Input() alertId!: number
  alert: boolean = false

  constructor (private alertService: AlertsService){}

  ngOnInit(): void {
    this.alertService.videoEnded$.subscribe(mapId => {
      console.log(mapId)
      this.alert = (mapId == this.alertId)
    })
  }

  closeAlarm(): void{
    this.alert = false
  }
}
