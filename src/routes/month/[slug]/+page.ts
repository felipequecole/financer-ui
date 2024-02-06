import {error} from '@sveltejs/kit';
import BillStore from "../../../lib/stores/billStore";


type MonthData = {
    subscription: BillStore
}

/** @type {import('./$types').PageLoad} */
export async function load({params}): Promise<MonthData> {
    const monthId = params.slug;
    const monthExists = await BillStore.exists(monthId);
    if (monthExists) {
        return {
            subscription: new BillStore(monthId)
        }
    }

    error(404, {message: "Month not found", type: "NOT_FOUND"});

}