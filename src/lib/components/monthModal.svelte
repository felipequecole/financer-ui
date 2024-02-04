<script lang="ts">
    import {Button, Input, Label, Modal, Checkbox} from 'flowbite-svelte';
    import {expensesStore} from "$lib/stores/expensesStore.ts";
    import {onDestroy, onMount} from "svelte";
    import {type Unsubscriber} from "svelte/store";
    import {monthStore} from "$lib/stores/monthStore";


    export let modalOpen = false;

    type ExpenseStatus = {
        [key: string]: boolean;
    }
    let activeExpensesStatus: ExpenseStatus = {};
    let dateInput: string = (new Date()).toJSON().slice(0, 10);
    let incomeInput: number | undefined = undefined;
    let userDate: Date | null;
    let selectedMonth: number | undefined = undefined;
    let selectedYear: number | undefined = undefined;
    let valid: boolean = false;

    $: userDate = dateInput ? new Date(dateInput) : null;
    $: selectedMonth = userDate ? userDate.getMonth() + 1 : undefined;
    $: selectedYear = userDate ? userDate.getFullYear() : undefined;
    $: valid = selectedMonth !== null && selectedYear !== null && Object.values(activeExpensesStatus).some((status) => status);

    $: console.log(dateInput)
    $: console.log(userDate)
    $: console.log(selectedMonth)
    $: console.log(selectedYear)

    $: console.table(activeExpensesStatus);

    function createMonth() {
        let selectedExpenses = Object.entries(activeExpensesStatus)
            .filter(([_, status]) => status)
            .map(([id, _]) => id);
        monthStore.add({
            month: selectedMonth,
            year: selectedYear,
            expenses: selectedExpenses,
            income_value: incomeInput,
        });
    }

    let unsub: any = null;
    let expenses: Expense[] = [];
    onMount(() => {
        unsub = expensesStore.subscribe((value: Expense[]) => {
            expenses = [...value];
            value.forEach((expense) => {
                if (expense.active) {
                    if (activeExpensesStatus.hasOwnProperty(expense.id)) {
                        activeExpensesStatus[expense.id] = activeExpensesStatus[expense.id] ? activeExpensesStatus[expense.id] : true;
                    } else {
                        activeExpensesStatus[expense.id] = true;
                    }
                }
                activeExpensesStatus = {...activeExpensesStatus};
            })
        })
    });

    onDestroy(() => {
        if (unsub) {
            unsub.then((u: Unsubscriber) => {
                u();
            });
        }
    });
</script>

<Modal bind:open={modalOpen} size="xs" autoclose={true} outsideclose class="w-full">
    <form class="flex flex-col space-y-6 mx-auto" action="#">
        <h4 class="mt-[-5] text-xl font-medium text-gray-900 dark:text-white text-center">Create a new
            month</h4>
        <Label class="space-y-2">
            <span> Select the month</span>
            <Input type="date"
                   placeholder="Select the month"
                   bind:value={dateInput}
                   required
            />
        </Label>

        <Label class="space-y-2">
            <span> (Optional) Set month income</span>
            <Input type="number"
                   placeholder="0.00"
                   bind:value={incomeInput}
            />
        </Label>

        <div class="flex flex-col-1 space-x-1">
            <Label class="space-y-2">
                <span>Select which expenses you want to add: </span>
                {#each expenses as expense}
                    {#if expense.active }
                        <Checkbox bind:checked="{activeExpensesStatus[expense.id]}">
                            {expense.name} - R${expense.amount}
                        </Checkbox>
                    {/if}
                {/each}
            </Label>
        </div>

        <Button type="submit" class="w-full1" on:click={createMonth} disabled="{!valid}">Save</Button>
    </form>
</Modal>