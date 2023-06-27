import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  colorTheme = '';
  darkColorTheme = '[dark·mode]';
  lightColorTheme = '[light·mode]';

  constructor() {
    this.colorTheme = this.darkColorTheme;
    if (localStorage.getItem('dark')) {
      document.documentElement.classList.add('dark');
      this.colorTheme = this.lightColorTheme;
    }
  }

  darkMode() {
    document.documentElement.classList.toggle('dark');
    if (document.documentElement.classList.contains('dark')) {
      this.colorTheme = this.lightColorTheme;
      localStorage.setItem('dark', 'true');
    } else {
      this.colorTheme = this.darkColorTheme;
      localStorage.removeItem('dark');
    }
  }
}
