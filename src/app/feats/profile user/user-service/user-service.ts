import { Service } from '@angular/core';

@Service()
export class UserService {
  avatars = [
  { id: '1', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Felix' },
  { id: '2', url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Coco' },
  { id: '3', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Gizmo' },
  { id: '4', url: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Zoe' },
  { id: '5', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bandit' },
  { id: '6', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Precious' }
];
selectedAvatar: string = this.avatars[0].url; 

selectAvatar(url: string) {
  this.selectedAvatar = url;
}
}
