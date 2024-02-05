import {
    type Writable,
    writable,
    derived,
    type Readable,
    type Subscriber,
    type Invalidator,
    type Unsubscriber
} from 'svelte/store';
import arraySort from "array-sort";
import {v4 as uuidv4} from 'uuid';
import {env} from "$env/dynamic/public";

const api_url = env.PUBLIC_API_URL;

class ExpenseStore {
    store: Writable<Expense[]> | undefined;
    sorted: Readable<Expense[]> | undefined;
    clients: Map<string, Unsubscriber> | undefined;
    socket: WebSocket | undefined;

    constructor() {
        this.clients = new Map<string, Unsubscriber>();
    }

    initWebSocket() {
        console.log('Initializing websocket')
        this.socket = new WebSocket(`ws://${api_url}/expenses/ws`)
        this.socket.addEventListener("open", () => {
            console.log("Opened")
        });
        this.socket.addEventListener("message", (event) => {
            console.log("Message received")
            const message = JSON.parse(event.data)
            console.log(message)
            if (this.store) {
                if (message.action == 'delete') {
                    this.store.update((expenses) => {
                        return expenses.filter((e) => e.id !== message.data.id);
                    });
                } else {
                    this.store.update((expenses) => {
                        const sliced = expenses.filter((e) => e.id !== message.data.id);
                        return [...sliced, message.data];
                    });
                }
            }
        });
    }

    async subscribe(run: Subscriber<Expense[]>, invalidate?: Invalidator<Expense[]> | undefined) {
        console.log('Subscribing to expenses')
        if (!this.store) {
            this.store = writable(await fetchExpenses());
        }
        if (!this.sorted) {
            this.sorted = derived(this.store, (expenses) => {
                return arraySort(expenses, ['due_day', 'name', 'amount', 'id'], {
                    reverse: false,
                    place: false,
                    algorithm: 'quick'
                });
            })
        }

        const sub_id = uuidv4();

        if (!this.clients) {
            this.clients = new Map();
        }
        this.clients.set(sub_id, this.sorted.subscribe(run, invalidate));

        if (!this.socket) {
            this.initWebSocket();
        }

        return () => this.unsubscribe(sub_id);
    }

    unsubscribe(sub_id: string) {
        console.log(`Unsubscribing ${sub_id}`)
        if (this.clients) {
            const unsub = this.clients.get(sub_id)
            if (unsub) {
                unsub();
                this.clients.delete(sub_id);
            }
        }

        if ((!this.clients || this.clients.size === 0) && this.socket) {
            console.log('Closing expense update websocket')
            this.socket.close();
        }
    }

    async add(expense: Expense) {
        fetch('http://localhost:8000/expenses', {
            method: 'POST',
            body: JSON.stringify(expense),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res)
        })
    }

    async remove(id: string) {
        fetch(`http://${api_url}/expenses/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.status === 200) {
                    console.log("Deleted")
                } else {
                    console.log("Error deleting expense", res)
                }
            })
            .catch(err => console.log(err));
    }

    async update(expense: Expense) {
        fetch(`http://${api_url}/expenses/${expense.id}`, {
            method: 'PATCH',
            body: JSON.stringify(expense),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json()
                        .then(bill => {
                            console.log("Updated", bill)
                        })
                } else {
                    console.log("Error updating expense", res)
                }
            })
            .catch(err => console.log(err));
    }


}

type ExpenseResponse = {
    data: Expense[]
}

async function fetchExpenses(): Promise<Expense[]> {
    return fetch(`http://${api_url}/expenses?limit=50`)
        .then(res => res.json())
        .then((data: ExpenseResponse) => {
            return data.data;
        });
}

export const expensesStore = new ExpenseStore();