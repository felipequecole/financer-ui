import {
    derived,
    type Invalidator,
    type Readable,
    type Subscriber,
    type Unsubscriber,
    type Writable,
    writable
} from 'svelte/store';
import arraySort from "array-sort";
import {v4 as uuidv4} from 'uuid';

const api_url = import.meta.env.VITE_API_URL;

type MonthResponse = {
    data: Month[]
}

type MonthMessage = {
    action: string,
    data: Month
}

class MonthStore {
    store: Writable<Month[]> | undefined;
    sorted: Readable<Month[]> | undefined;
    clients: Map<string, Unsubscriber> | undefined;
    socket: WebSocket | undefined;

    constructor() {
        this.clients = new Map<string, Unsubscriber>();
    }

    initWebSocket() {
        console.log('Initializing websocket')
        this.socket = new WebSocket(`ws://${api_url}/month/ws`)
        this.socket.addEventListener("open", () => {
            console.log("Opened")
        });
        this.socket.addEventListener("message", (event) => {
            if (this.store) {
                console.log("Month received")
                const message: MonthMessage = JSON.parse(event.data)
                console.log(message)
                if (message.action == 'delete') {
                    this.store.update((months) => {
                        return months.filter((e) => e.id !== message.data.id);
                    });
                } else {
                    this.store.update((months) => {
                        const sliced = months.filter((e) => e.id !== message.data.id);
                        return [...sliced, message.data];
                    });
                }
            }
        });
    }

    async subscribe(run: Subscriber<Month[]>, invalidate?: Invalidator<Month[]> | undefined) {
        console.log('Subscribing to months')
        if (!this.store) {
            this.store = writable(await fetchMonth());
        }
        if (!this.sorted) {
            this.sorted = derived(this.store, (month) => {
                return arraySort(month, ['year', 'month', 'id'], {reverse: true, place: false, algorithm: 'quick'})
            });
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

    async add(monthRequest: MonthRequest) {
        await createMonth(monthRequest);
    }

    async remove(id: string) {
        await deleteMonth(id);
    }

}


async function fetchMonth(): Promise<Month[]> {
    return fetch(`http://${api_url}/month?limit=50`)
        .then(res => res.json())
        .then((data: MonthResponse) => {
            return data.data;
        });
}

async function createMonth(monthRequest: MonthRequest) {
    fetch(`http://${api_url}/month/create`, {
        method: 'POST',
        body: JSON.stringify(monthRequest),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        console.log(res)
    })
}

async function deleteMonth(id: string) {
    fetch(`http://${api_url}/month/${id}`, {
        method: 'DELETE'
    })
        .then(res => {
            if (res.status === 204) {
                console.log("Deleted")
            } else {
                console.log("Error deleting month", res)
            }
        })
        .catch(err => console.log(err));
}


export const monthStore = new MonthStore();