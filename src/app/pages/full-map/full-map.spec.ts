import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullMap } from './full-map';

describe('FullMap', () => {
  let component: FullMap;
  let fixture: ComponentFixture<FullMap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullMap],
    }).compileComponents();

    fixture = TestBed.createComponent(FullMap);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
