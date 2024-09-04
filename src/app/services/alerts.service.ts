import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private videoEndedSource = new Subject<number>(); 
  videoEnded$ = this.videoEndedSource.asObservable();

  notifyVideoEnded(mapId: number){
    this.videoEndedSource.next(mapId)
  }
}
