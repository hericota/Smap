import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfiguracoesAdmin } from './configuracoes-admin';

describe('ConfiguracoesAdmin', () => {
  let component: ConfiguracoesAdmin;
  let fixture: ComponentFixture<ConfiguracoesAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracoesAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfiguracoesAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
