import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription, bufferTime, filter, fromEvent, interval } from "rxjs";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class Timer implements OnInit, OnDestroy {
  time: string = '';
  private subscription: Subscription = new Subscription();
  private timerStarted: boolean = false;
  private waitDoubleClicks$ = fromEvent(document, 'click').pipe(
    bufferTime(300),
    filter(clicks => clicks.length === 2)
  );
  timerPaused: boolean = false;

  ngOnInit() {
    this.time = this.formatTime(0);

    this.subscription = interval(1000).subscribe(() => {
      if (this.timerStarted) {
        this.time = this.incrementTime(this.time);
      }
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  startTimer() {
    this.timerStarted = true;
  }

  stopTimer() {
    this.timerStarted = false;
    this.time = this.formatTime(0);
  }

  waitTimer() {
    this.waitDoubleClicks$.subscribe(() => {
      this.timerStarted = !this.timerStarted;
      this.timerPaused = true;
    });
  }

  resetTimer() {
    this.time = this.formatTime(0);
    this.timerStarted = true;
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(remainingSeconds)}`;
  }

  private padZero(num: number): string {
    return num.toString().padStart(2, '0');
  }

  private incrementTime(time: string): string {
    const timeParts = time.split(':');
    const hours = Number(timeParts[0]);
    const minutes = Number(timeParts[1]);
    const seconds = Number(timeParts[2]);

    const totalSeconds = hours * 3600 + minutes * 60 + seconds + 1;

    return this.formatTime(totalSeconds);
  }
}
