import { Component } from '@angular/core';
import { BottomNav } from '../../../components/bottom-nav/bottom-nav';
import { RouterLink } from '@angular/router';
import { MapaSeparado } from '../../../components/mapa-separado/mapa-separado';

@Component({
  imports: [BottomNav, RouterLink, MapaSeparado],
  selector: 'app-profile-home',
  styleUrl: './profile-home.css',
  templateUrl: './profile-home.html',
})
export class ProfileHome {}
