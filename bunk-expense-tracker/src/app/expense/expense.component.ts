import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment/environment';

interface Expense {
  name: string;
  amount: number;
}

interface Payout {
  owes: string;
  owed: string;
  amount: number;
}

interface PayoutResponse {
  total: number;
  equalShare: number;
  payouts: Payout[];
}

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent {
  expenses: Expense[] = [
  ];
  newExpense: Expense = {
    name: '',
    amount: 0
  }
  payouts: Payout[] = [];
  total: number = 0;
  equalShare: number = 0;
  isSettled: boolean = false;

  constructor(private http: HttpClient) {}

  addExpense() {
    this.expenses.push(this.newExpense);
    this.newExpense = {
      name: '',
      amount: 0
    }
  }

  async calculatePayouts() {
    const requestBody = { expenses: this.expenses };
    this.http.post<PayoutResponse>(`${environment.API_URL}/payouts`, requestBody).subscribe(
      response => {
        this.payouts = response.payouts;
        this.total = response.total;
        this.equalShare = response.equalShare;
        this.isSettled = true;
      },
      error => {
        console.error('Error calculating payouts', error);
      }
    );
  }
}
