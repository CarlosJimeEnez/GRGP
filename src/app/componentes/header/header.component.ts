import { Component, ChangeDetectionStrategy } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { SidebarComponent } from "../sidebar/sidebar.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatIconModule,
    SidebarComponent
],
  template: `
    <section>
      <div class="">
          <div class="row align-items-center justify-content-start">
            <div class="col-2 d-flex d-md-none  justify-content-center">
              <button class="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                <mat-icon >menu</mat-icon>
              </button>
            </div>

            <div class="col-4 d-flex align-items-center m-2">
                <img class="logo-img" src="images/GRGP_Badge-Monogram-Vertical-Lettering_Colored.svg" alt="" srcset="">
              </div>
            
            <div class="col-6 text-center">
              <div class="title">
                <h1>Demo</h1>
                <div class="date">
                    <p>../../..</p>
                  </div>
              </div>
            </div>
          </div>
      </div>

      <div class="offcanvas offcanvas-start custom-width" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
        <div class="offcanvas-header">
          
        </div>
        <div class="offcanvas-body">
          <div>
            <app-sidebar/>
          </div>          
        </div>
      </div>

    </section>  
  `, 
  styles: `
    .header-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: var(--m4);
    margin-left: var(--m4);
}

.custom-width {
  width: 15vh,
  
}

h1 {
    margin: 0px;
}

.date {
    margin: 0;
}

.icon{
    margin: var(--m2);
}

.title {
    font-weight: bold;
}

.logo-img {   
    width: 100px;
    height: auto;
}

.example-form {
    width: 100%;
}

.example-full-width {
    width: 100%;
}
  `,
})
export class HeaderComponent {
  myControl = new FormControl("");
  options: string[] = [""]
}
