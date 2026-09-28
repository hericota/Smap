import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetalheOcorrecia } from './detalhe-ocorrecia';

describe('DetalheOcorrecia', () => {
  let component: DetalheOcorrecia;
  let fixture: ComponentFixture<DetalheOcorrecia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalheOcorrecia],
    }).compileComponents();

    fixture = TestBed.createComponent(DetalheOcorrecia);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
