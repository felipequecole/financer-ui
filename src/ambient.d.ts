declare global {
    interface Expense {
        id: string,
        name: string,
        amount: number,
        due_day: number,
        active: boolean,
        create_at: string,
    }

    interface Month {
        id: string,
        year: number,
        month: number,
        total_expense: number,
        total_income: number,
        balance: number,
        first_date_day: number,
        last_date_day: number,
        paid: boolean,
    }

    interface MonthRequest {
        year?: number,
        month?: number,
        income_value?: number,
        expenses?: str[]
    }

    interface Bill {
        id: string,
        name: string,
        amount: number,
        day: number,
        paid: boolean,
        paid_at: string,
        create_at: string,
        updated_at: string,
    }

    interface Income {
        id: string,
        name: string,
        amount: number,
        create_at: string,
        updated_at: string,
    }

}

export {};
