import { Component, OnInit } from '@angular/core';
import { ServicesService } from 'src/app/utils/services.service';
import { environment } from 'src/environments/environment.development';
import { Modal } from 'flowbite';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{

  pagination: number = 0;
  filtro: string = "";
  products: any[] =[];
  paginas: number = 0;

  carrito: any[] = [];
  cantidad: number = 1;
  auxProduct: any;

  mostrarModalSecundario: boolean = false;

  nrodocid: string = "";

  client: any;

  total: number = 0.00;

  venta: any;

  modalCreateUsuario: any;
  documento:string = "";
  data : any;
  usuario: any;

  constructor(private service: ServicesService, private http: HttpClient){
    //const targetEl = document.getElementById('crud-modal');
    //this.modalCreateUsuario = new Modal(targetEl);
  }

  async ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.usuario = localStorage.getItem('user');
    await this.getProducts();

  }

  async getProducts() {

    let body = {
      'lista_precio' : environment.lista_precio,
      'pagina' : this.pagination,
      'filtroxnombre' : this.filtro.toUpperCase(),
      'filtroxcategoria' : "",
      'compania' : environment.Compania,
      'sucursal' : environment.Sucursal
    };
    await this.service.consulta('list-products','post', body).subscribe(resp => {

      console.log(resp);
      this.products = resp['data']['items'];
      this.products = this.products.map(product => ({...product, imageLoaded: true}));
      this.paginas = resp['data']['total_paginas'];
      console.log(this.products);
    });
  }

  handleImageError(product: any) {
    // Cambia la URL de la imagen a la imagen por defecto en caso de error
    product.imageUrl = "./../../assets/logo.svg";
    product.imageLoaded = false; // Cambia el estado para mostrar la imagen por defecto
  }

  selectProduct(product: any){

    this.auxProduct = product;
    const options = {
      placement: 'bottom-right',
      backdrop: 'dynamic',
      backdropClasses:
          'bg-gray-900/50 dark:bg-gray-900/80 fixed inset-0 z-40',
      closable: true,
      onHide: () => {
          console.log('modal is hidden');
      },
      onShow: () => {
          console.log('modal is shown');
      },
      onToggle: () => {
          console.log('modal has been toggled');
      },
    };

    const instanceOptions = {
      id: 'modalEl',
      override: true
    };
    const targetEl = document.getElementById('popup-modal');
    const modal = new Modal(targetEl);

    modal.show();
  }

  cerrarModal(){
    const targetEl = document.getElementById('popup-modal');
    const modal = new Modal(targetEl);

    modal.hide();
  }

  async addCart() {
    let auxProduct = this.auxProduct;
    auxProduct['cantidad'] = this.cantidad;
    auxProduct['monto'] = this.cantidad * auxProduct['precio'];
    this.total += auxProduct['monto'];
    this.carrito.push(auxProduct);
    console.log(this.carrito);

    this.cerrarModal();
    this.cantidad = 1;
  }

  removeCart(indice: any){
    if (indice >= 0 && indice < this.carrito.length) {
      this.total -= this.carrito[indice]['monto'];
      this.carrito.splice(indice, 1); // Elimina el producto en el índice especificado
    }
  }

  generarArray(size: number): number[] {
    return new Array(size);
  }

  async getClient(){
    if (this.nrodocid.length == 8 || this.nrodocid.length == 11) {
      let body = {
        "nrodocid" : this.nrodocid,
        'compania' : environment.Compania,
      'sucursal' : environment.Sucursal
      };
      await this.service.consulta('search-client','post', body).subscribe(resp => {

        console.log(resp);
        this.client = resp['data'];

        //this.paginas = resp['data']['total_paginas'];
        //console.log(this.products);
      });
    }
  }

  async guardarVenta() {
    let bodyDetail = [];
    for (let i = 0; i < this.carrito.length; i++) {
      let detail = {
        'sku' : this.carrito[i]['item_cod'],
        'unidad_medida' : this.carrito[i]['unidad_man'],
        'cantidad' : this.carrito[i]['cantidad']
      };
      bodyDetail.push(detail);
    }

    const hoy = new Date();
    const formatoFecha = new Intl.DateTimeFormat('es', { year: 'numeric', month: '2-digit', day: '2-digit' });

    let body = {
      'plataforma_origen' : '1',
      'usuario' : this.usuario['usuario'],//'VENDEDOR1',
      'cod_comprobante' : this.client.tipodocid == 'DNI' ? 'BOL' : 'FXC',
      'serie_comprobante' : 'B801',
      'fecha_comprobante' : formatoFecha.formatToParts(hoy),//'2023-11-21',
      'vendedor' : '10247812',
      'lista_precio' : environment.lista_precio,
      'nro_document_ide' : this.client.nrodocide,
      'client' : this.client.cliente,
      'forma_pago' : "001",
      'moneda' : 'PEN',
      'detalle_sales' : bodyDetail,
      'compania' : environment.Compania,
      'sucursal' : environment.Sucursal
    }
    const targetEl = document.getElementById('popup-modal-result');
      const modal = new Modal(targetEl);

    console.log(body);
    await this.http.post('https://backend-pos.atiendo.pe/api/save-sale', body, { responseType: 'blob' }).subscribe(/*resp => {
      //actualizado
      console.log(resp);
      this.venta = resp;

      this.carrito = [];
      this.client = null;
      this.total = 0.00;

      modal.show();

      //this.paginas = resp['data']['total_paginas'];
      //console.log(this.products);
    }*/
    (blob: Blob) => {
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'venta.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    },
    error => {
      console.error('Error al guardar la venta y generar el PDF:', error);
      // Manejar el error de acuerdo a tus necesidades
    }
    );

  }

  cerrarModalVenta(){
    const targetEl = document.getElementById('popup-modal-result');
    const modal = new Modal(targetEl);

    modal.hide();
  }

  modalUsuario(){
    this.modalCreateUsuario.show();
  }

  async buscarDocumentoApiPeru(){
    console.log(this.documento.length);
    let header = {
      'Accept' : 'application/json',
      'Content-Type': 'application/json',
      'Authorization' : 'Bearer 7e0173d10d1258cbdc300c40ad9b31776ee8c09fdc2e69b4935da818187337fb'
    };
    let body = {
      'dni' : this.documento
    }
    if (this.documento.length == 8) {
      await this.http.post('https://apiperu.dev/api/dni', body,{headers: header}).subscribe((resp) => {
        console.log(resp);
        this.data = resp;
      })
    }
  }
}
