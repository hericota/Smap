import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaAdmin } from './mapa-admin';

describe('MapaAdmin', () => {
  let component: MapaAdmin;
  let fixture: ComponentFixture<MapaAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(MapaAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
