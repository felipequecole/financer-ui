<script lang="ts">
    import {expensesStore} from "$lib/stores/expensesStore.js";
    import {Button, Checkbox, Input, Label, Modal} from "flowbite-svelte";
    import {createEventDispatcher} from "svelte";

    export let modalOpen = false;

    const dispatcher = createEventDispatcher();


</script>

<Modal bind:open={modalOpen} size="xs" autoclose={true} outsideclose class="w-full">
    <form class="flex flex-col space-y-6 mx-auto" action="#">
        <h4 class="mt-[-5] text-xl font-medium text-gray-900 dark:text-white text-center">Are you sure?</h4>

        <Button type="submit" class="w-full1" on:click={() => dispatcher('confirmed')}>Confirm</Button>
    </form>
</Modal>