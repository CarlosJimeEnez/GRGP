import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private crashDetectionSource = new BehaviorSubject<boolean>(false);
    crashDetection$ = this.crashDetectionSource.asObservable();
    setCrashDetection(value: boolean): void {
        this.crashDetectionSource.next(value);
    }
}
