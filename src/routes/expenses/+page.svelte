<script lang="ts">
    import {
        GradientButton,
    } from 'flowbite-svelte';

    import ExpenseTable from '$lib/components/expenseTable.svelte';
    import ExpenseModal from '$lib/components/expenseModal.svelte';
    import {onMount} from "svelte";

    let modalOpen: boolean = false;
    let editingExpenseId: string | null = null;

    function editExpense(event: CustomEvent) {
        editingExpenseId = event.detail.id;
        console.log(`Editing expense with id ${editingExpenseId}`);
        modalOpen = true;
    }

    onMount(() => {
        document.title = "Financer - Expenses";
    });

    $: editingExpenseId = modalOpen ? editingExpenseId : null;

    // todo: event dispatcher to send open modal signal when editing

</script>

<div class="flex flex-col items-stretch">
    <div class="pt-4 pb-4">
        <p class="text-4xl dark:text-white text-center">My Expenses</p>
    </div>
    <ExpenseTable on:edit={editExpense}/>
    <div class="flex flex-col pt-4">
        <GradientButton outline color="greenToBlue" class="self-stretch" on:click={() => modalOpen = true}>Add new
            Expense
        </GradientButton>
    </div>

    {#if modalOpen}
        <ExpenseModal bind:modalOpen={modalOpen} bind:expenseId={editingExpenseId}/>
    {/if}

</div>
