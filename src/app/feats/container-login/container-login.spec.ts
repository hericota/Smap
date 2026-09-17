import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContainerLogin } from './container-login';

describe('ContainerLogin', () => {
  let component: ContainerLogin;
  let fixture: ComponentFixture<ContainerLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
