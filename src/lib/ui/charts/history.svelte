<script lang="ts">
    import {Chart, Card} from 'flowbite-svelte';
    import {ArrowDownSolid, ArrowUpSolid} from 'flowbite-svelte-icons';
    import {type MonthMetric, getMonthExpenseMetrics} from "$lib/graphql/metrics";
    import {onMount} from "svelte";

    let monthData: MonthMetric[] = [];

    let incomeData: string[] = [];
    let expenseData: string[] = [];
    let labels: string[] = [];
    let totalIncome: string = '0';
    let totalExpense: string = '0';
    let totalProfit: number = 0;
    let profitRate: string = '0';
    let incomeSeries = {};
    let expenseSeries = {};
    let indicatorClass: string = '';

    $: incomeData = monthData.map((item: MonthMetric) => item.incomeTotal.toFixed(2));
    $: expenseData = monthData.map((item: MonthMetric) => item.billTotal.toFixed(2));
    $: labels = monthData.map((item: MonthMetric) => item.monthName);
    $: totalIncome = incomeData.map((val) => Number(val)).reduce((prev, curr) => prev + curr, 0).toFixed(2);
    $: totalExpense = expenseData.map((val) => Number(val)).reduce((prev, curr) => prev + curr, 0).toFixed(2);
    $: totalProfit = (Number(totalIncome) - Number(totalExpense));
    $: profitRate = ((totalProfit / Number(totalIncome)) * 100).toFixed(2);
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
    $: indicatorClass = totalProfit > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';

    $: console.table(monthData);
    $: console.log(incomeData);
    $: console.log(expenseData);
    $: console.log(labels);


    onMount(async () => {
        monthData = await getMonthExpenseMetrics('SLUG_DESC');
    });

    let options: ApexCharts.ApexOptions = {}

    $: options = {
        series: [incomeSeries, expenseSeries],
        chart: {
            sparkline: {
                enabled: false
            },
            type: 'bar',
            width: '100%',
            height: 400,
            toolbar: {
                show: false
            }
        },
        fill: {
            opacity: 1
        },
        plotOptions: {
            bar: {
                horizontal: true,
                columnWidth: '100%',
                borderRadiusApplication: 'end',
                borderRadius: 6,
                dataLabels: {
                    position: 'top'
                }
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
        tooltip: {
            shared: true,
            intersect: false,
            formatter: function (value) {
                return 'R$' + value;
            }
        },
        xaxis: {
            labels: {
                show: true,
                style:
                    {
                        fontFamily: 'Inter, sans-serif',
                        cssClass:
                            'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                    }
                ,
                formatter: function (value) {
                    return 'R$' + value;
                }
            }
            ,
            categories: labels,
            axisTicks:
                {
                    show: false
                }
            ,
            axisBorder: {
                show: false
            }
        }
        ,
        yaxis: {
            labels: {
                show: true,
                style:
                    {
                        fontFamily: 'Inter, sans-serif',
                        cssClass:
                            'text-xs font-normal fill-gray-500 dark:fill-gray-400 dark:text-white'
                    }
            }
        }
        ,
        grid: {
            show: true,
            strokeDashArray:
                4,
            padding:
                {
                    left: 2,
                    right:
                        2,
                    top:
                        -20
                }
        }
    }
    ;
</script>

<Card>
    <div class="flex justify-between border-gray-200 border-b dark:border-gray-700 pb-3">
        <dl>
            <dt class="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Profit</dt>
            <dd class:text-red-500={totalProfit < 0}
                class:text-gray-900={totalProfit >= 0}
                class:dark:text-white={totalProfit >= 0}
                class="leading-none text-3xl font-bold text-gray-900 dark:text-white">{totalProfit > 0 ? '' : '-'}
                R${(Math.abs(totalProfit)).toFixed(2)}</dd>
        </dl>
        <div>
      <span class="{indicatorClass} text-xs font-medium inline-flex items-center px-2.5 py-1 rounded-md">
          {#if Number(profitRate) > 0}
        <ArrowUpSolid class="w-2.5 h-2.5 me-1.5"/>
              {:else}
              <ArrowDownSolid class="w-2.5 h-2.5 me-1.5"/>
              {/if}

          Profit rate {profitRate}%
      </span>
        </div>
    </div>

    <div class="grid grid-cols-2 py-3">
        <dl>
            <dt class="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Income</dt>
            <dd class="leading-none text-xl font-bold text-green-500 dark:text-green-400">R${totalIncome}</dd>
        </dl>
        <dl>
            <dt class="text-base font-normal text-gray-500 dark:text-gray-400 pb-1">Expense</dt>
            <dd class="leading-none text-xl font-bold text-red-600 dark:text-red-500">-R${totalExpense}</dd>
        </dl>
    </div>

    <Chart {options}/>
</Card>