import { Component } from '@angular/core';
import { BottomNav } from '../../../components/bottom-nav/bottom-nav';
import { RouterLink } from '@angular/router';

@Component({
  imports: [BottomNav, RouterLink],
  selector: 'app-profile-home',
  styleUrl: './profile-home.css',
  templateUrl: './profile-home.html',
})
export class ProfileHome {}
