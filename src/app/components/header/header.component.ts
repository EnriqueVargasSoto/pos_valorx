import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ServicesService } from 'src/app/utils/services.service';
import { Dial } from 'flowbite';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  usuario : any;
  private localStorageKey = 'user';

  constructor(private service: ServicesService, private router: Router){

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const parentEl = document.getElementById('user-dropdown');
    const options = {
      triggerType: 'click',
      onHide: () => {
          console.log('speed dial is shown');
      },
      onShow: () => {
          console.log('speed dial is hidden');
      },
      onToggle: () => {
          console.log('speed dial is toggled');
      },
    };

    //const dial = new Dial(parentEl, triggerEl, targetEl, options, instanceOptions);

    // instance options with default values
    const instanceOptions = {
      id: 'dialContent',
      override: true
    };

    const userJson = localStorage.getItem(this.localStorageKey);
    console.log(userJson);
    this.usuario = JSON.parse(userJson!);
  }

  logout(){
    this.service.logout();
    this.router.navigate(['/login']);
  }

}
