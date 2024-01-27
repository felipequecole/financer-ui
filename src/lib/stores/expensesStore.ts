import {type Writable, writable, derived, type Readable} from 'svelte/store';

const store: Writable<Expense[]> = writable(await fetchExpenses());
const sorted: Readable<Expense[]> = derived(store, (expense) => {
    return expense.sort((a, b) => a.id - b.id);
})

async function fetchExpenses(): Promise<Expense[]> {
    const res = await fetch('http://localhost:8000/expenses');
    return await res.json();
}


function resync() {
    fetchExpenses()
        .then((expenses) => {
            store.update(() => {
                return expenses;
            });
        })
        .catch(err => console.log(err));
}

async function addExpense(expense: Expense) {
    const res = await fetch('http://localhost:8000/expenses', {
        method: 'POST',
        body: JSON.stringify(expense),
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const response = await res.json();
    console.log(response)
    resync();
}

async function deleteExpense(id: number) {
    fetch(`http://localhost:8000/expenses/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.status === 200) {
                res.json().then(() => {
                    store.update((expenses) => {
                        return expenses.filter((e) => e.id !== id);
                    });
                })
            } else {
                console.log("Error deleting expense")
            }
        })
        .catch(err => console.log(err));
}

async function updateExpense(expense: Expense) {
    fetch(`http://localhost:8000/expenses/${expense.id}`, {
        method: 'PATCH',
        body: JSON.stringify(expense),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => {
            if (res.status === 200) {
                res.json()
                    .then(expense => {
                        store.update((expenses) => {
                            return expenses.map((ex) => {
                                if (ex.id === expense.id) {
                                    return expense;
                                }
                                return ex;
                            });
                        });
                    })
            } else {
                console.log("Error updating expense")
            }
        })
        .catch(err => console.log(err));
}


export const expensesStore = {
    subscribe: sorted.subscribe,
    add: async (expense: Expense) => {
        await addExpense(expense);
    },
    remove: async (id: number) => {
        await deleteExpense(id);
    },
    update: async (expense: Expense) => {
        console.log("Updating on store")
        await updateExpense(expense);
    }
}