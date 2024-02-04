<script lang="ts">
    import {Button, Card, Listgroup, ListgroupItem} from 'flowbite-svelte';
    import MonthModal from "$lib/components/monthModal.svelte";
    import MonthCards from "$lib/components/monthCards.svelte";
    import {onMount} from "svelte";

    let modalOpen: boolean = false;

    onMount(() => {
        document.title = "Financer - Months";
    });



</script>

<div class="flex flex-col items-stretch">
    <div class="pt-4 pb-4 justify-center">
        <p class="text-4xl dark:text-white text-center">Months</p>
        <div class="flex mx-auto justify-center">
            <Button color="primary" class="mt-4" on:click={() => {modalOpen = true}}>Add Month</Button>
        </div>
    </div>

    <MonthCards/>


    {#if modalOpen}
        <MonthModal bind:modalOpen/>
    {/if}

</div>