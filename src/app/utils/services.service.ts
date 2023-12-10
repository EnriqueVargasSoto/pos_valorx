import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  public isAuthenticated: boolean = false;
  private localStorageKey = 'user';

  api = environment.apiUrl;//+'&Compania='+environment.Compania+'&Sucursal='+environment.Sucursal;

  constructor(private http: HttpClient, private router: Router) { }

  consulta(url: string, metodo: string, body?: any): Observable<any> {
    switch (metodo) {
      case 'get':
        return this.http.get(`${this.api}${url}`);
        break;

      case 'post':
        return this.http.post(`${this.api}${url}`, body);
        break;

      case 'put':
        return this.http.put(`${this.api}${url}`, body);
        break;

      case 'delete':
        return this.http.delete(`${this.api}${url}`);
        break;

      default:
        return this.http.get(`${this.api}${url}`);
        break;
    }
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
    this.isAuthenticated = false;
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {


    const userJson = localStorage.getItem(this.localStorageKey);

    this.isAuthenticated =  userJson ? true : false;
    return this.isAuthenticated;
  }
}
