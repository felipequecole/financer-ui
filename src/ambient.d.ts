declare global {
    interface Expense {
        id: number,
        name: string,
        amount: number,
        due_day: number,
        active: boolean,
        create_at: string,
    }

}

export {};
