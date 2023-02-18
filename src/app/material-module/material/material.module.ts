import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],

  exports:[
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule, 
  ]
})
export class MaterialModule { }
