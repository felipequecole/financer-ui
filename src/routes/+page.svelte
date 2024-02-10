<script>
    import {onMount} from "svelte";
    import ExpenseDivision from '$lib/ui/charts/expenseDivision.svelte';
    import ExpenseTrend from '$lib/ui/charts/expenseTrend.svelte';
    import History from '$lib/ui/charts/history.svelte';
    import {getMonthExpenseMetrics} from '$lib/graphql/metrics'


</script>

<h1 class="dark:text-white text-center text-6xl mb-8">Finances App</h1>

<div class="grid grid-cols-3 w-full justify-start ">
    <div class="">
        <ExpenseDivision/>
    </div>
    <div class="">
        <History />
    </div>
    <div class="">
        <ExpenseTrend/>
    </div>
</div>




