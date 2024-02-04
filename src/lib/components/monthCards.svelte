<script lang="ts">
    import {CheckCircleSolid, ThumbsDownSolid, TrashBinSolid} from "flowbite-svelte-icons";
    import {Card, Listgroup, ListgroupItem} from "flowbite-svelte";
    import {onDestroy, onMount} from "svelte";
    import {monthStore} from "$lib/stores/monthStore.js";
    import ConfirmationModal from "$lib/ui/confirmationModal.svelte";

    let months: Month[] = [];
    let confirmationOpen: boolean = false;
    let to_be_deleted: string | null = null;
    let unsub: Promise<any> | undefined = undefined;

    onMount(() => {
        unsub = monthStore.subscribe((value) => {
            months = value;
        });
    });

    onDestroy(() => {
        if (unsub) {
            unsub.then(u => u());
        }
    })

    $: console.log(months);

    function deleteMonth(month_id: string) {
        console.log(`Deleting month ${month_id}`);
        monthStore.remove(month_id);
    }


</script>

<div class="grid lg:grid-cols-3 grid-cols-1 justify-items-stretch">
    {#each months as month (month.id)}
        <Card padding="xl" size="md">
            <div class="flex justify-between items-center mb-4">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">{month.id}</h5>
                <a href="month/{month.id}"
                   class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"> View
                    all </a>
            </div>
            <Listgroup class="border-0 dark:!bg-transparent">
                <ListgroupItem>
                    <div class="flex items-center space-x-4 rtl:space-x-reverse">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Income
                            </p>
                        </div>
                        <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            R${month.total_income ? Number(month.total_income).toFixed(2) : Number(0).toFixed(2)}
                        </div>
                    </div>
                </ListgroupItem>
                <ListgroupItem>
                    <div class="flex items-center space-x-4 rtl:space-x-reverse">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Expenses
                            </p>
                        </div>
                        <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            R${Number(month.total_expense).toFixed(2)}
                        </div>
                    </div>
                </ListgroupItem>
                <ListgroupItem>
                    <div class="flex items-center space-x-4 rtl:space-x-reverse">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Paid
                            </p>
                        </div>
                        <div class="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                            {#if month.paid}
                                <CheckCircleSolid class="w-5 h-5 text-green-500"/>
                            {:else}
                                <ThumbsDownSolid class="w-5 h-5 text-red-500"/>
                            {/if}
                        </div>
                    </div>
                </ListgroupItem>
                <ListgroupItem>
                    <div class="flex items-center space-x-4 rtl:space-x-reverse">
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
                                Balance
                            </p>
                        </div>
                        <div class="inline-flex items-center text-base font-semibold"
                             class:text-red-500={month.balance < 0} class:dark:text-white={month.balance > 0}>
                            {#if month.balance < 0}
                                -R${Math.abs(Number(month.balance)).toFixed(2)}
                            {:else if month.balance > 0}
                                R${Number(month.balance).toFixed(2)}
                            {:else}
                                R${Number(0).toFixed(2)}
                            {/if}
                        </div>
                    </div>
                </ListgroupItem>

                <!--                <div class="flex w-full place-content-center">-->
                <button on:click={() => {to_be_deleted= month.id; confirmationOpen=true}}
                        class="link flex self-stretch w-full mt-2 place-content-center p-3 text-sm font-medium text-center text-red-600 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-red-500 hover:underline rounded-b-lg">
                    <TrashBinSolid class="w-6 h-6 ms-1 me-2"/>
                    Delete month
                </button>
                <!--                </div>-->


            </Listgroup>
        </Card>
    {/each}
</div>

<ConfirmationModal bind:modalOpen={confirmationOpen} on:confirmed={() => deleteMonth(to_be_deleted)}/>
