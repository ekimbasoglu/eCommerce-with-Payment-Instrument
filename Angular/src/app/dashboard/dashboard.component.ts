import { Component } from '@angular/core';
import { components } from '../common/components';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  components = components.filter((component) => !!component.card);
}
