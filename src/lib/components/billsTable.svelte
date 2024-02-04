<script lang="ts">
    import {
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Toggle
    } from "flowbite-svelte";
    import {expensesStore} from '$lib/stores/expensesStore';
    import {onDestroy, createEventDispatcher} from "svelte";
    import BillStore from "$lib/stores/billStore";


    export let billStore: BillStore;

    let bills: Bill[] = []

    const unsub = billStore.subscribe(billStored => {
        bills = billStored;
    });

    onDestroy(() => {
        if (unsub) {
            unsub.then(u => u());
        }
    });

    let sumExpense = 0;

    $: sumExpense = bills ? bills.reduce((acc, bill) => acc + Number(bill.amount), 0) : 0;

    const expenseEdit = createEventDispatcher();

    function deleteBill(id: string) {
        console.log(`Deleting ${id}`)
        billStore.remove(id);
    }

    function updateBill(bill: Bill) {
        console.log(`Updating ${bill.id}`)
        billStore.update(bill);
    }

    function editBill(id: string) {
        console.log(`Editing ${id}`);
        expenseEdit('edit', {id});
    }

</script>

<Table hoverable={true}>
    <TableHead>
        <!--        <TableHeadCell>-->
        <!--            <span class="sr-only">id</span>-->
        <!--        </TableHeadCell>-->
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Amount</TableHeadCell>
        <TableHeadCell>Due Day</TableHeadCell>
        <TableHeadCell>Paid</TableHeadCell>
        <TableHeadCell>
            <span class="sr-only">Actions</span>
        </TableHeadCell>
    </TableHead>
    <TableBody>
        {#each bills as bill (bill.id)}
            <TableBodyRow>
                <!--                <TableBodyCell>{expense.id}</TableBodyCell>-->
                <TableBodyCell>{bill.name}</TableBodyCell>
                <TableBodyCell class="capitalize">R${Number(bill.amount).toFixed(2)}</TableBodyCell>
                <TableBodyCell>{bill.day}</TableBodyCell>
                <TableBodyCell class="justify-center">
                    <Toggle bind:checked={bill.paid} color="green"
                            on:change={() => updateBill(bill)}/>
                </TableBodyCell>
                <TableBodyCell class="grid-rows-2 ">
                    <button class="link pr-4" on:click={() => editBill(bill.id)}>Edit</button>
                    <button class="link" on:click={() => deleteBill(bill.id)}>Remove</button>
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
    <tfoot>
    <tr class="font-semibold text-gray-900 dark:text-white">
        <th scope="row" class="py-3 px-6 text-base">Total</th>
        <td class="py-3 px-6">R${sumExpense.toFixed(2)}</td>
    </tr>
    </tfoot>
</Table>