<script lang="ts">
    import {Button, Modal, Label, Input, Toggle, InputAddon, ButtonGroup, Helper} from 'flowbite-svelte';
    import {DollarSolid, CalendarMonthSolid} from 'flowbite-svelte-icons';
    import {onDestroy, onMount} from 'svelte';
    import {type Unsubscriber} from "svelte/store";
    import BillStore from "$lib/stores/billStore";

    export let modalOpen: boolean = false;
    export let billId: string | null = null;
    export let billStore: BillStore;

    let bill: Bill | any = {};
    let billPaid: boolean = false;
    let unsub: Promise<Unsubscriber> | null = null;
    let valid: boolean = false;
    let dayValid: boolean = false;
    let nameValid: boolean = false;

    onMount(() => {
        if (billId) {
            unsub = billStore.subscribe((bills: Bill[]) => {
                bill = bills.find((bill: Bill) => bill.id === billId);
            });
        } else {
            bill = {
                paid: false,
                day: null,
                amount: null,
            };
        }
    });

    onDestroy(() => {
        if (unsub) {
            unsub.then((u: Unsubscriber) => {
                u();
            });
        }
    });

    $: billPaid = bill.paid ? bill.paid : false;
    $: dayValid = bill.day > 0 && bill.day <= 31;
    $: nameValid = bill.name && bill.name.length > 0;
    $: valid = dayValid && nameValid;

    function save() {
        if (bill.id) {
            billStore.update(bill)
                .then(() => {
                    modalOpen = false;
                })
                .catch((error: Error) => {
                    console.error(error);
                });
        } else {
            billStore.add(bill)
                .then(() => {
                    modalOpen = false;
                })
                .catch((error: Error) => {
                    console.error(error);
                });
        }
    }


</script>

<Modal bind:open={modalOpen} size="xs" autoclose={false} outsideclose class="w-full">
    <form class="flex flex-col space-y-6" action="#">
        <h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create new Bill</h3>
        <div class="flex flex-col-2 space-x-10">
            <Label class="flex-auto">
                <span>ID</span>
                <Input type="text" class="flex-auto text-xs" name="id" value="{billId}" disabled/>
            </Label>
            <div>
                <Label class="space-y-2">
                    <span>Paid</span>
                    <Toggle
                            bind:checked="{billPaid}"
                            on:change="{() => bill.paid = !bill.paid}"
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
                    bind:value="{bill.name}"
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
                        bind:value="{bill.day}"
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
                        bind:value="{bill.amount}"
                />
            </ButtonGroup>
        </div>
        <Button type="submit" class="w-full1" on:click={save} disabled="{!valid}">Save</Button>
    </form>
</Modal>

