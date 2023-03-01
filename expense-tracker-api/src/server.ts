import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';

interface Expense {
    name: string;
    amount: number;
}

interface Payout {
    owes: string;
    owed: string;
    amount: number;
}

interface CalculatePayoutsRequest {
    expenses: Expense[];
}

interface CalculatePayoutsResponse {
    total: number;
    equalShare: number;
    payouts: Payout[];
}

export const app = express();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());

app.post('/payouts', (req, res) => {
    const { expenses }: CalculatePayoutsRequest = req.body;

    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0);

    let balances: Record<string, number> = {};

    expenses.forEach(expense => {
        if (balances[expense.name]) {
            balances[expense.name] += expense.amount;
        } else {
            balances[expense.name] = expense.amount;
        }
    });

    const equalShare = total / Object.keys(balances).length;
    Object.keys(balances).forEach(key => {
        balances[key] = balances[key] - equalShare;
    });

    const payouts: Payout[] = [];
    for (let [owed, amount] of Object.entries(balances)) {
        if (amount > 0) {
            for (let [owes, owedAmount] of Object.entries(balances)) {
                if (owedAmount < 0 && amount > 0) {
                    const payoutAmount = Math.min(-owedAmount, amount);
                    payouts.push({ owes, owed, amount: payoutAmount });
                    amount -= payoutAmount;
                    balances[owed] += payoutAmount;
                    balances[owes] -= payoutAmount;
                }
            }
        }
    }

    const response: CalculatePayoutsResponse = { total, equalShare, payouts };
    res.json(response);
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
