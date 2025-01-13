import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat',
  standalone: true,
})
export class TimeFormatPipe implements PipeTransform {

  transform(seconds: number): string {
    if (isNaN(seconds) || seconds < 0) {
      return '00:00:00';
    }

    const totalSeconds = Math.round(seconds);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    return `${this.padTo2Digits(hours)}:${this.padTo2Digits(minutes)}:${this.padTo2Digits(remainingSeconds)}`;
  }

  private padTo2Digits(num: number): string {
    return num.toString().padStart(2, '0');
  }
}
