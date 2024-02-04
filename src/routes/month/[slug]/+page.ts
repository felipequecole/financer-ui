import BillStore from "../../../lib/stores/billStore";


type MonthData = {
    subscription: BillStore
}

/** @type {import('./$types').PageLoad} */
export function load({params}): MonthData {
    return {
        subscription: new BillStore(params.slug)
    }
}