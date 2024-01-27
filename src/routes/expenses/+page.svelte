<script lang="ts">
    import {
        GradientButton,
    } from 'flowbite-svelte';

    import ExpenseTable from '$lib/components/expenseTable.svelte';
    import ExpenseModal from '$lib/components/expenseModal.svelte';

    let modalOpen: boolean = false;

    // todo: event dispatcher to send open modal signal when editing

</script>

<div class="flex flex-col items-stretch">
    <div class="pt-4 pb-4">
        <p class="text-4xl dark:text-white text-center">My Expenses</p>
    </div>
    <ExpenseTable/>
    <div class="flex flex-col pt-4">
        <GradientButton outline color="greenToBlue" class="self-stretch" on:click={() => modalOpen = true}>Add new
            Expense
        </GradientButton>
    </div>
    <!--    TODO implement modal for adding a new expense-->
    <ExpenseModal bind:formModal={modalOpen}/>

</div>
