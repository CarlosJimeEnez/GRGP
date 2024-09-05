import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule
  ],
  template: `
    <section>
    <div class="container">
        <div class="row align-items-center ">
            <div class="col-2 m-2">
                <img class="logo-img" src="images/GRGP_Badge-Monogram-Vertical-Lettering_Colored.svg" alt="" srcset="">
            </div>
            <div class="col d-flex align-items-center">
                <div class="title">
                    <h1>Demo</h1>
                    <div class="date">
                        <p>../../..</p>
                     </div>
                 </div>
            </div>
            <div class="col d-flex justify-content-end ">
                
              <form class="example-form">
                <mat-form-field class="example-full-width">
                  <mat-label>
                    Search
                  </mat-label>

                  <input type="text"
                          placeholder=""
                          aria-label=""
                          matInput
                          [formControl]="myControl"
                          [matAutocomplete]="auto">
                  <mat-autocomplete #auto="matAutocomplete">
                    @for (option of options; track option) {
                      <mat-option [value]="option">{{option}}</mat-option>
                    }
                  </mat-autocomplete>
                </mat-form-field>
              </form>

               
            </div>
        </div>
    </div>
</section>  
  `, 
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  myControl = new FormControl("");
  options: string[] = [""]
}
