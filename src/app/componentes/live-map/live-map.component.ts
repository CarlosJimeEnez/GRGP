import { Component, ElementRef, Input, Output, ViewChild,} from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { AlertsService } from '../../services/alerts.service';
import { EventEmitter } from 'stream';

@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule],
  templateUrl: './live-map.component.html',
  styleUrl: './live-map.component.css'
})
export class LiveMapComponent  {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>; // Accede al elemento video
  @Input() src!: string; 
  @Input() mapId!: number; 
  isPlaying = false;

  constructor(private alertService: AlertsService) {}

  togglePlayPause() {
    const video = this.videoRef.nativeElement;
    if (video.paused || video.ended) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  onVideoEnded() {
    this.isPlaying = false;
    this.alertService.notifyVideoEnded(this.mapId)
  }
}
