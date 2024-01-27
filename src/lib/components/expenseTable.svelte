<script lang="ts">
    import AiOutlineEdit from "svelte-icons-pack/ai/AiOutlineEdit.js";
    import AiOutlineDelete from "svelte-icons-pack/ai/AiOutlineDelete.js";
    import Icon from 'svelte-icons-pack/Icon.svelte';
    import {
        Button,
        Table,
        TableBody,
        TableBodyCell,
        TableBodyRow,
        TableHead,
        TableHeadCell,
        Toggle
    } from "flowbite-svelte";
    import {expensesStore} from '$lib/stores/expensesStore.ts';
    import {onDestroy} from "svelte";

    let expenses: Expenses[];
    let loading = false;

    const unsub = expensesStore.subscribe(storeExpenses => {
        expenses = storeExpenses;
    });

    onDestroy(() => {
        if (unsub) {
            unsub();
        }
    });

    function deleteExpense(id: number) {
        console.log(`Deleting ${id}`)
        loading = true;
        expensesStore.remove(id)
            .then(() => {
                loading = false;
            })
            .catch(err => {
                console.log(err);
                loading = false;
            });
    }

    function updateExpense(event, expense) {
        console.log("update expense");
        console.log(event);
        loading = true;
        expensesStore.update(expense)
            .then(() => {
                loading = false;
            })
            .catch(err => {
                console.log(err);
                loading = false;
            });
    }

</script>

<Table hoverable={true}>
    <TableHead>
        <TableHeadCell>
            <span class="sr-only">id</span>
        </TableHeadCell>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Amount</TableHeadCell>
        <TableHeadCell>Due Day</TableHeadCell>
        <TableHeadCell>Active</TableHeadCell>
        <TableHeadCell>
            <span class="sr-only">Actions</span>
        </TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
        {#each expenses as expense (expense.id)}
            <TableBodyRow>
                <TableBodyCell>{expense.id}</TableBodyCell>
                <TableBodyCell>{expense.name}</TableBodyCell>
                <TableBodyCell class="capitalize">R${Number(expense.amount).toFixed(2)}</TableBodyCell>
                <TableBodyCell>{expense.due_day}</TableBodyCell>
                <TableBodyCell class="justify-center">
                    <Toggle bind:checked={expense.active} color="green"
                            on:change={(event) => updateExpense(event, expense)}/>
                </TableBodyCell>
                <TableBodyCell class="grid-rows-2">
                    <Button outline color="green" class="mr-2">
                        <Icon src="{AiOutlineEdit}" className="fill-current h-6" size="1.5em"/>
                    </Button>
                    <Button outline color="red" on:click={() => deleteExpense(expense.id)}>
                        <Icon src="{AiOutlineDelete}" className="fill-current h-6 w-6" size="1.5em"/>
                    </Button>
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>