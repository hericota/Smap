import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapaSeparado } from './mapa-separado';

describe('MapaSeparado', () => {
  let component: MapaSeparado;
  let fixture: ComponentFixture<MapaSeparado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapaSeparado],
    }).compileComponents();

    fixture = TestBed.createComponent(MapaSeparado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
