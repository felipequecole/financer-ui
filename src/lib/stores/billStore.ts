import {
    type Writable,
    writable,
    derived,
    type Readable,
    type Subscriber,
    type Invalidator,
    type Unsubscriber
} from 'svelte/store';
import arraySort from 'array-sort';
import {v4 as uuidv4} from 'uuid';
import {env} from "$env/dynamic/public";

const api_url = env.PUBLIC_API_URL;

class BillStore {

    store: Writable<Bill[]> | undefined;
    sorted: Readable<Bill[]> | undefined;
    clients: Map<string, Unsubscriber> | undefined;
    socket: WebSocket | undefined;
    month_id: string;

    static async exists(month_id: string): Promise<boolean> {
        return await fetch(`http://${api_url}/month/${month_id}`)
            .then(res => res.status === 200)
            .catch(err => {
                console.log(err);
                return false;
            });
    }

    constructor(month_id: string) {
        this.month_id = month_id;
    }

    initWebSocket(month_id: string) {
        console.log('Initializing websocket')
        this.socket = new WebSocket(`ws://${api_url}/bill/ws/${month_id}`)
        this.socket.addEventListener("open", () => {
            console.log("Opened")
        });
        this.socket.addEventListener("message", (event) => {
            console.log("Message received")
            const message = JSON.parse(event.data)
            console.log(message)
            if (this.store) {
                if (message.action == 'delete') {
                    this.store.update((bills) => {
                        return bills.filter((e) => e.id !== message.data.id);
                    });
                } else {
                    this.store.update((bills) => {
                        const sliced = bills.filter((e) => e.id !== message.data.id);
                        return [...sliced, message.data];
                    });
                }
            }

        });
    }

    async subscribe(run: Subscriber<Bill[]>, invalidate?: Invalidator<Bill[]> | undefined) {
        console.log('Subscribing')
        if (!this.store) {
            this.store = writable(await fetchBills(this.month_id));
        }
        if (!this.sorted) {
            this.sorted = derived(this.store, (bill) => {
                return arraySort(bill, ['day', 'name', 'amount', 'id'], {
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
            this.initWebSocket(this.month_id);
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
            console.log('Closing bill update websocket')
            this.socket.close();
        }
    }

    async add(bill: Bill) {
        fetch(`http://${api_url}/bill/${this.month_id}`, {
            method: 'POST',
            body: JSON.stringify(bill),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res)
        })
    }

    async remove(id: string) {
        fetch(`http://${api_url}/bill/${id}`, {
            method: 'DELETE'
        })
            .then(res => {
                if (res.status === 204) {
                    console.log("Deleted")
                } else {
                    console.log("Error deleting bill", res)
                }
            })
            .catch(err => console.log(err));
    }

    async update(bill: Bill) {
        fetch(`http://${api_url}/bill/${bill.id}`, {
            method: 'PATCH',
            body: JSON.stringify(bill),
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
                    console.log("Error updating bill")
                }
            })
            .catch(err => console.log(err));
    }

}

type BillResponse = {
    data: Bill[]
}

async function fetchBills(month_id: string): Promise<Bill[]> {
    return await fetch(`http://${api_url}/bill/${month_id}?limit=50`)
        .then(res => res.json())
        .then((data: BillResponse) => {
            return data.data;
        })
        .catch(err => {
            console.log(err);
            return [];
        });
}


export default BillStore;
