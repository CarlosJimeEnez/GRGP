import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-live-statistics',
  standalone: true,
  imports: [],
  template: `
  <div class="card">
    <h5 class="card-title p-3">Live statitics</h5>
    <div class="container">
        <div class="row align-items-center ">
            <!-- Laps -->
            <div class="col text-start">
                <p>Laps: </p>
            </div>
            <div class="col text-end">
                <!-- <p>22/44</p> -->
                 <p>2</p>
            </div>
        </div>
        <!-- Current Leader -->
        <div class="row align-items-center text-center">
            <div class="col text-start">
                <p>Current leader: </p>
            </div>
            <div class="col text-end">
                <p>Jenny</p>
            </div>
        </div>
        <!-- Fastes Lap -->
        <div class="row align-items-center text-center">
            <div class="col text-start">
                <p>Fastest Lap: </p>
            </div>
            <div class="col text-end">
                <p>{{time}}</p>
            </div>
        </div>
    </div>
  </div>
  `,
  styleUrl: './live-statistics.component.css'
})
export class LiveStatisticsComponent implements OnInit {
    time: number = 0 
    constructor(private alertService: AlertsService){}

    ngOnInit(): void {
        this.alertService.timeDetection$.subscribe((val) => {
            this.time = val
        })
    }
}
