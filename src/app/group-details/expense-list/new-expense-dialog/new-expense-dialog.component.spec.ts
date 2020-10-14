import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewExpenseDialogComponent } from './new-expense-dialog.component';

describe('NewExpenseDialogComponent', () => {
  let component: NewExpenseDialogComponent;
  let fixture: ComponentFixture<NewExpenseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewExpenseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewExpenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
