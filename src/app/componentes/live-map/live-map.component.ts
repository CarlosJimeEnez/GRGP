import { AfterViewChecked, AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-live-map',
  standalone: true,
  imports: [MatCheckboxModule, CommonModule],
  templateUrl: './live-map.component.html',
  styleUrl: './live-map.component.css'
})
export class LiveMapComponent  {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>; // Accede al elemento video
  isPlaying = false;

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
  }
}
