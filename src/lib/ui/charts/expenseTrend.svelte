<script lang="ts">
    import {Chart, Card} from 'flowbite-svelte';
    import {ChevronRightSolid} from 'flowbite-svelte-icons';
    import {onMount} from "svelte";
    import {getMonthExpenseMetrics, type MonthMetric} from '$lib/graphql/metrics';

    let monthData: MonthMetric[] = [];

    let incomeData: string[] = [];
    let expenseData: string[] = [];
    let labels: string[] = [];
    let totalExpense: string = '0';
    let incomeSeries = {};
    let expenseSeries = {};
    let trendPercent: number = 0;

    $: incomeData = monthData.map((item: MonthMetric) => item.incomeTotal.toFixed(2));
    $: expenseData = monthData.map((item: MonthMetric) => item.billTotal.toFixed(2));
    $: labels = monthData.map((item: MonthMetric) => item.monthName);
    $: totalExpense = expenseData.map((val) => Number(val)).reduce((prev, curr) => prev + curr, 0).toFixed(2);
    $: incomeSeries = {
        name: 'Income',
        color: '#31C48D',
        data: incomeData
    };
    $: expenseSeries = {
        name: 'Expense',
        data: expenseData,
        color: '#F05252'
    };
    $: trendPercent = (Number(expenseData[expenseData.length - 1]) - Number(expenseData[expenseData.length - 2])) / Number(expenseData[expenseData.length - 2]) * 100;


    onMount(async () => {
        monthData = await getMonthExpenseMetrics('SLUG_ASC');
    });

    let options: ApexCharts.ApexOptions = {}

    $: options = {
        chart: {
            height: '400px',
            maxWidth: '100%',
            type: 'area',
            fontFamily: 'Inter, sans-serif',
            dropShadow: {
                enabled: false
            },
            toolbar: {
                show: false
            }
        },
        tooltip: {
            enabled: true,
            x: {
                show: false
            }
        },
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: '#1C64F2',
                gradientToColors: ['#1C64F2']
            }
        },
        legend: {
            show: true,
            position: 'bottom',
            labels: {
                useSeriesColors: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            width: 6
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: 0
            }
        },
        series: [
            incomeSeries, expenseSeries
        ],
        xaxis: {
            categories: labels,
            labels: {
                show: false
            },
            axisBorder: {
                show: false
            },
            axisTicks: {
                show: false
            }
        },
        yaxis: {
            show: false
        }
    };
</script>

<Card>
    <div class="flex justify-between">
        <div>
            <h5 class="leading-none text-3xl font-bold text-gray-900 dark:text-white pb-2">R${totalExpense}</h5>
            <p class="text-base font-normal text-gray-500 dark:text-gray-400">Total Expense last {expenseData.length}
                months</p>
        </div>
        <div class="flex items-center px-2.5 py-0.5 text-base font-semibold text-green-500 dark:text-green-500 text-center">
            {trendPercent.toFixed(2)}%
            <ChevronRightSolid class="w-3 h-3 ms-1"/>
        </div>
    </div>
    <Chart {options}/>
</Card>