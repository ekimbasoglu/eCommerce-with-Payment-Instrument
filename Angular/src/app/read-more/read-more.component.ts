import { Component } from '@angular/core';

@Component({
  selector: 'app-read-more',
  templateUrl: './read-more.component.html',
  styleUrls: ['./read-more.component.css'],
})
export class ReadMoreComponent {
  isOpen = false;
  read: any = '[read·more]';

  toggleAccordion() {
    this.isOpen = !this.isOpen;
    this.read = this.isOpen == true ? '[read·less]' : '[read·more]';
  }
}
