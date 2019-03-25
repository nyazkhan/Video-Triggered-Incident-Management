import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) { }
  /**
   * Indicates that current user has the rights to register another user or not.
   * Used to Show/Hide the Register Button
   */
  registerAuhtority = false;

  ngOnInit() {
    // this.setRegisterAuthority();
  }

  /**Sets value of @property registerAuthority*/
  setRegisterAuthority() {
    const authorities: Array<{ id: number, name: string }> = JSON.parse(localStorage.getItem('userInfo')).authorities;
    this.registerAuhtority = authorities.findIndex((auth) => auth.name === 'USER_WRITE') > -1;
  }

  /**Called on logout button,clear all data and navigate to login page */
  onLogout() {
    this.router.navigate(['/login']);
    localStorage.clear();
  }
}
