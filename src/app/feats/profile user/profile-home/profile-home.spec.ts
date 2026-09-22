import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileHome } from './profile-home';

describe('ProfileHome', () => {
  let component: ProfileHome;
  let fixture: ComponentFixture<ProfileHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileHome],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
