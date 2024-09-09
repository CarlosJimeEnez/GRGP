import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private crashDetectionSource = new BehaviorSubject<boolean>(false);
  private timeDetectionSource = new BehaviorSubject<number>(0)

  crashDetection$ = this.crashDetectionSource.asObservable();
  timeDetection$ = this.timeDetectionSource.asObservable(); 

  setCrashDetection(value: boolean): void {
      this.crashDetectionSource.next(value);
  }

  setTimeDetection(val: any): void {
    this.timeDetectionSource.next(val)
  }
}
