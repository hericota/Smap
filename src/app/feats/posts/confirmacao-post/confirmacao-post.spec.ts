import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacaoPost } from './confirmacao-post';

describe('ConfirmacaoPost', () => {
  let component: ConfirmacaoPost;
  let fixture: ComponentFixture<ConfirmacaoPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmacaoPost],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmacaoPost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
