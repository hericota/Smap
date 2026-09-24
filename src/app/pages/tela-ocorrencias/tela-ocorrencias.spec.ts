import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TelaOcorrencias } from './tela-ocorrencias';

describe('TelaOcorrencias', () => {
  let component: TelaOcorrencias;
  let fixture: ComponentFixture<TelaOcorrencias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TelaOcorrencias],
    }).compileComponents();

    fixture = TestBed.createComponent(TelaOcorrencias);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
