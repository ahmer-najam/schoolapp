import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css','../../animate.css']
})
export class HomeComponent implements OnInit {

  constructor() { }
  scrollToElement($element): void {
    console.log($element);
    $element.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"});
  }

  ngOnInit() {
  }

  goToLink(url: string): void {
    window.open(url, "_blank");
  }

 

}
