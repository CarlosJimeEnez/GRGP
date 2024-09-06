import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [FontAwesomeModule],
  template: `
  <div class="container">
    <h1>as</h1>
    
  </div>
  `, 
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
