<script lang="ts">
    import {Button, Modal, Label, Input, Toggle, InputAddon, ButtonGroup, Helper} from 'flowbite-svelte';
    import {expensesStore} from '$lib/stores/expensesStore.ts'
    import {DollarSolid, CalendarMonthSolid} from 'flowbite-svelte-icons';
    import {onDestroy, onMount} from 'svelte';

    export let modalOpen: boolean = false;
    export let expenseId: number = null;

    let expense: Expense = {};
    let expenseActive: boolean = true;
    const unsub = null;
    let valid: boolean = false;
    let dayValid: boolean = false;
    let nameValid: boolean = false;

    onMount(() => {
        if (expenseId) {
            expensesStore.subscribe((expenses: Expense[]) => {
                expense = expenses.find((expense: Expense) => expense.id === expenseId);
            });
        } else {
            expense = {
                active: true,
                due_day: null,
                amount: null,
            };
        }
    });

    onDestroy(() => {
        if (unsub) {
            unsub();
        }
    });

    $: console.log(expense);
    $: expenseActive = expense.active ? expense.active : false;
    $: console.log(expenseActive)
    $: dayValid = expense.due_day > 0 && expense.due_day <= 31;
    $: nameValid = expense.name && expense.name.length > 0;
    $: valid = dayValid && nameValid;

    function save() {
        if (expense.id) {
            expensesStore.update(expense)
                .then(() => {
                    modalOpen = false;
                })
                .catch((error: Error) => {
                    console.error(error);
                });
        } else {
            expensesStore.add(expense)
                .then(() => {
                    modalOpen = false;
                })
                .catch((error: Error) => {
                    console.error(error);
                });
        }
    }

    // todo: add due day validation

</script>

<Modal bind:open={modalOpen} size="xs" autoclose={false} outsideclose class="w-full">
    <form class="flex flex-col space-y-6" action="#">
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create/Edit Monthly Expense</h3>
        <div class="flex flex-col-2 space-x-10">
            <Label class="space-y-2">
                <span>ID</span>
                <Input type="number" name="id" value="{expenseId}" disabled/>
            </Label>
            <div>
                <Label class="space-y-2">
                    <span>Active</span>
                    <Toggle
                            bind:checked="{expenseActive}"
                            on:change="{() => expense.active = !expense.active}"
                            color="green"
                            class="self-stretch pt-2.5"
                    />
                </Label>
            </div>
        </div>
        <Label class="space-y-2">
            <span>Name</span>
            <Input
                    type="text"
                    name="name"
                    placeholder="Rent, Internet, etc"
                    bind:value="{expense.name}"
                    color="{nameValid ? 'base' : 'red'}"
                    required/>
            {#if !nameValid}
                <Helper class='mt-2' color='red'><span class="font-medium">Invalid due day</span> Should be &gt 0 and
                    &lt= 31.
                </Helper>
            {/if}
        </Label>
        <div class="mb-6">
            <Label class="block mb-2">Due day</Label>
            <ButtonGroup class="w-full">
                <InputAddon>
                    <CalendarMonthSolid class="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                </InputAddon>
                <Input
                        type="number"
                        name="due_day"
                        placeholder="Which day of the mounth it is due"
                        bind:value="{expense.due_day}"
                        color="{dayValid ? 'base' : 'red'}"
                        required/>
            </ButtonGroup>
            {#if !dayValid}
                <Helper class='mt-2' color='red'><span class="font-medium">Invalid due day</span> Should be &gt 0 and
                    &lt= 31.
                </Helper>
            {/if}
        </div>
        <div class="mb-6">
            <Label class="block mb-2">Amount</Label>
            <ButtonGroup class="w-full">
                <InputAddon>
                    <DollarSolid class="w-4 h-4 text-gray-500 dark:text-gray-400"/>
                </InputAddon>
                <Input
                        type="number"
                        name="amount"
                        placeholder="100.00"
                        bind:value="{expense.amount}"
                />
            </ButtonGroup>
        </div>
        <Button type="submit" class="w-full1" on:click={save} disabled="{!valid}">Save</Button>
    </form>
</Modal>

