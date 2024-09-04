import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [],
  template: `
    <section>
      <p class="d-inline-flex gap-1">
          <button class="btn btn-primary" (click)="onToggle()" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample1" aria-expanded="false" aria-controls="multiCollapseExample1">
              {{firstButtonText}}
          </button>
          <button class="btn btn-primary" (click)="onToggle()" type="button" data-bs-toggle="collapse" data-bs-target="#multiCollapseExample2" aria-expanded="false" aria-controls="multiCollapseExample2">
              {{secondButtonText}}
          </button>
      </p>
      
      <div class="accordion" id="accordionExample">
          @if (isOpen()) {
            <div class="collapse" id="multiCollapseExample1" data-bs-parent="#accordionExample">
              <div class="card card-body">
                {{firstTextBody}}
              </div>
          </div>
          }
          
          <div class="collapse" id="multiCollapseExample2" data-bs-parent="#accordionExample">
              <div class="card card-body">
                {{secondTextBody}}
              </div>
          </div>
      </div>  
    </section>
  `, 
  styleUrl: './accordion.component.css'
})
export class AccordionComponent {
@Input() firstButtonText!: string
@Input() secondButtonText!: string
@Input() firstTextBody!: string
@Input() secondTextBody!: string
@Input() accordionId!: string; 
@Input() activeAccordion!: string ; 

@Output() toggleAccordion = new EventEmitter<string>();

// Método para manejar el toggle del acordeón
onToggle() {
  this.toggleAccordion.emit(this.accordionId);
}

// Método para verificar si este acordeón está abierto
isOpen() {
  console.log(this.activeAccordion)
  return this.activeAccordion === this.accordionId;
}
}

