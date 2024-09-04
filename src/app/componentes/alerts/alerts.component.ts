import { Component, Input, OnInit } from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import { MatIcon } from '@angular/material/icon';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [MatBadgeModule, MatIcon],
  templateUrl: './alerts.component.html',
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
