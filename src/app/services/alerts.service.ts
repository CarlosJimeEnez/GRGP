import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

export interface Alert {
  id: number;
  type: string; // Puede ser 'success', 'warning', etc.
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  private crashDetectionSource = new BehaviorSubject<boolean>(false);
  private timeDetectionSource = new BehaviorSubject<number>(0)
  private tableDataSource = new BehaviorSubject<any>(0)

  crashDetection$ = this.crashDetectionSource.asObservable();
  timeDetection$ = this.timeDetectionSource.asObservable(); 
  dataDetection$ = this.tableDataSource.asObservable()

  private alerts: Alert[] = [];
  private alertsSubject: BehaviorSubject<Alert[]> = new BehaviorSubject<Alert[]>([]);

  // Observable para obtener las alertas
  getAlerts(): Observable<Alert[]> {
    return this.alertsSubject.asObservable();
  }

  // Método para agregar una alerta
  addAlert(type: string, message: string) {
    const newAlert: Alert = {
      id: this.alerts.length + 1,
      type: type,
      message: message
    };
    this.alerts.push(newAlert);
    this.alertsSubject.next(this.alerts);  // Notifica a los componentes suscriptores
  }

  setCrashDetection(value: boolean): void {
      this.crashDetectionSource.next(value);
  }

  setTimeDetection(val: any): void {
    this.timeDetectionSource.next(val)
  }

  setDataDetection(val: any): void {
    this.tableDataSource.next(val)
  }
}
