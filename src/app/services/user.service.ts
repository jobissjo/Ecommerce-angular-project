import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login, SignUp } from '../interface/signup';

@Injectable({
  providedIn: 'root'
})
export class UserService {
//   userUrl = "http://localhost:3000/users";
  userUrl = "https://json-server-template-tawny.vercel.app/users"
  invalidUserAuth = new EventEmitter<boolean>(false)
  constructor(private http:HttpClient, private router: Router) { }
  userSignUp(user:SignUp){
    // console.log(user);
    this.http.post<SignUp>(this.userUrl, user, {observe:'response'})
      .subscribe({
        next:data => {
          if(data){
            localStorage.setItem('user',JSON.stringify(data.body));
            console.log(JSON.stringify(data.body));
            this.router.navigate(['/'])
          }
          console.log(data);
        },error:data => {
          console.log(data  );
        }
      })
  }
  userLogin(data:Login){
    this.http.get<SignUp[]>(`${this.userUrl}?email=${data.email}&password=${data.password}`,
     {observe:'response'}).subscribe({
      next:result => {
        if(result && result.body?.length){
          localStorage.setItem('user',JSON.stringify(result.body[0]));
            this.router.navigate(['/'])
            this.invalidUserAuth.emit(false)
        }
        else{
          this.invalidUserAuth.emit(true)
        }
      },error:data=> {
        console.log(data);
      }
     })
  }
  userAuthReload(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/'])
    }
  }
  getCurrentUser(){
    let user = localStorage.getItem('user')
    return user && JSON.parse(user)
  }
  passwordChange(data:string){
    let user = this.getCurrentUser()
    let userId = user.id;
    user.password = data
    return this.http.put(`${this.userUrl}/${userId}`, user)
  }
}
