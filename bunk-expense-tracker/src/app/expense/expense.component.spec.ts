import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environment/environment';

import { ExpenseComponent } from './expense.component';

describe('ExpenseComponent', () => {
  let component: ExpenseComponent;
  let fixture: ComponentFixture<ExpenseComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [ExpenseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add expense to expenses array', () => {
    const expense = { name: 'Test Expense', amount: 100 };
    component.newExpense = expense;
    component.addExpense();
    expect(component.expenses).toContain(expense);
  });

  it('should calculate payouts correctly', () => {
    const expenses = [
      { "name": "Adriana", "amount": 5.75 },
      { "name": "Adriana", "amount": 5.75 },
      { "name": "Bao", "amount": 12 }
    ];
    const payoutResponse = {
      total: 23.5,
      equalShare: 11.75,
      payouts: [{ owes: 'Adriana', owed: 'Bao', amount: 0.25 }]
    };
    component.expenses = expenses;
    component.calculatePayouts();

    const req = httpTestingController.expectOne(`${environment.API_URL}/payouts`);
    expect(req.request.method).toEqual('POST');
    req.flush(payoutResponse);

    expect(component.payouts.length).toBe(1);
    expect(component.total).toBe(23.5);
    expect(component.equalShare).toBe(11.75);
    expect(component.payouts[0]['owes']).toBe('Adriana')
    expect(component.payouts[0]['owed']).toBe('Bao')
    expect(component.payouts[0]['amount']).toBe(0.25)
    expect(component.isSettled).toBeTruthy();
  });
});
