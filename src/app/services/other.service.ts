import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OtherService {
  collection$ = new BehaviorSubject<boolean>(true)
  constructor() { }
}
