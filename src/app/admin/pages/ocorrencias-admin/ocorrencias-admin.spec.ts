import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OcorrenciasAdmin } from './ocorrencias-admin';

describe('OcorrenciasAdmin', () => {
  let component: OcorrenciasAdmin;
  let fixture: ComponentFixture<OcorrenciasAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OcorrenciasAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(OcorrenciasAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
