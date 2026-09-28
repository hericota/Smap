import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginaOffline } from './pagina-offline';

describe('PaginaOffline', () => {
  let component: PaginaOffline;
  let fixture: ComponentFixture<PaginaOffline>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaOffline],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginaOffline);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
