import { Component } from '@angular/core';
import { BottomNav } from '../../../components/bottom-nav/bottom-nav';
import { RouterLink } from '@angular/router';

@Component({
  imports: [BottomNav, RouterLink],
  selector: 'app-profile-config',
  styleUrl: './profile-config.css',
  templateUrl: './profile-config.html',
})
export class ProfileConfig {}
