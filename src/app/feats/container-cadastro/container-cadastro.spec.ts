import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContainerCadastro } from './container-cadastro';

describe('ContainerCadastro', () => {
  let component: ContainerCadastro;
  let fixture: ComponentFixture<ContainerCadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContainerCadastro],
    }).compileComponents();

    fixture = TestBed.createComponent(ContainerCadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
