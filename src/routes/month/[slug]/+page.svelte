<script lang="ts">

    import BillStore from "$lib/stores/billStore";
    import BillTable from "$lib/components/billsTable.svelte";
    import {GradientButton} from "flowbite-svelte";
    import BillModal from "$lib/components/billModal.svelte";
    import {onMount} from "svelte";

    type MonthData = {
        subscription: BillStore
    }
    /** @type {import('./$types').PageData} */
    export let data: MonthData;

    let modalOpen = false;
    let subscription = data.subscription;
    let billEditing : string | undefined = undefined;

    function editBill(event: CustomEvent) {
        billEditing = event.detail.id;
        console.log(`Editing bill with id ${billEditing}`);
        modalOpen = true;
    }

    onMount(() => {
        document.title = `Financer - Month Details - ${subscription.month_id}`;
    });

    $: billEditing = modalOpen ? billEditing : undefined;


</script>

<div class="pt-4 pb-4">
    <p class="text-4xl dark:text-white text-center">Month Details - {subscription.month_id}</p>
</div>
<BillTable billStore="{subscription}" on:edit={editBill}/>
<div class="flex flex-col pt-4">
    <GradientButton outline color="greenToBlue" class="self-stretch" on:click={() => modalOpen = true}>Add new
        Bill
    </GradientButton>
</div>

{#if modalOpen}
    <BillModal bind:modalOpen={modalOpen} billStore="{subscription}" bind:billId={billEditing}/>
{/if}