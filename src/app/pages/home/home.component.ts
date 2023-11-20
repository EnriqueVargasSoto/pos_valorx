import { Component } from '@angular/core';
import { ServicesService } from 'src/app/utils/services.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private service: ServicesService){}

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    await this.getProducts();
  }

  async getProducts() {
    let body = {
      'lista_precio' : environment.lista_precio,
      'pagina' : 0,
      'filtroxnombre' : ""
    };
    await this.service.consulta('','get', body).subscribe(resp => {
      console.log(resp);
    });
  }
}
