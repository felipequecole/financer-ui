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
    import {onDestroy, createEventDispatcher, onMount} from "svelte";
    import type {Unsubscriber} from "svelte/store";


    let expenses: Expense[];
    let unsub: any = null;
    let sumExpense = 0;

    $: sumExpense = expenses ? expenses.reduce((acc, expense) => acc + Number(expense.amount), 0) : 0;

    onMount(() => {
        console.log('Mounting')
        unsub = expensesStore.subscribe(storeExpenses => {
            console.log(storeExpenses)
            expenses = storeExpenses;
        });
    })

    onDestroy(() => {
        if (unsub) {
            unsub.then((u: Unsubscriber) => {
                u();
            });
        }
    });

    const expenseEdit = createEventDispatcher();

    function deleteExpense(id: string) {
        console.log(`Deleting ${id}`)
        expensesStore.remove(id);
    }

    function updateExpense(expense: Expense) {
        console.log(`Updating ${expense.id}`)
        expensesStore.update(expense);
    }

    function editExpense(id: string) {
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
        <TableHeadCell>Active</TableHeadCell>
        <TableHeadCell>
            <span class="sr-only">Actions</span>
        </TableHeadCell>
    </TableHead>
    <TableBody>
        {#if expenses}
            {#each expenses as expense (expense.id)}
                <TableBodyRow>
                    <!--                <TableBodyCell>{expense.id}</TableBodyCell>-->
                    <TableBodyCell>{expense.name}</TableBodyCell>
                    <TableBodyCell class="capitalize">R${Number(expense.amount).toFixed(2)}</TableBodyCell>
                    <TableBodyCell>{expense.due_day}</TableBodyCell>
                    <TableBodyCell class="justify-center">
                        <Toggle bind:checked={expense.active} color="green"
                                on:change={() => updateExpense(expense)}/>
                    </TableBodyCell>
                    <TableBodyCell class="grid-rows-2 ">
                        <button class="link pr-4" on:click={() => editExpense(expense.id)}>Edit</button>
                        <button class="link" on:click={() => deleteExpense(expense.id)}>Remove</button>
                    </TableBodyCell>
                </TableBodyRow>
            {/each}
        {/if}
    </TableBody>
    <tfoot>
    <tr class="font-semibold text-gray-900 dark:text-white">
        <th scope="row" class="py-3 px-6 text-base">Total</th>
        <td class="py-3 px-6">R${sumExpense.toFixed(2)}</td>
    </tr>
    </tfoot>
</Table>