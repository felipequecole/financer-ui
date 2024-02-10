<script lang="ts">
    import {Chart, Card} from 'flowbite-svelte';
    import {onMount} from "svelte";
    import {getExpenseMetrics, type ExpenseMetric} from '$lib/graphql/metrics'

    let expenseMetrics: ExpenseMetric[] = [];
    let expenseData = {};

    function calculateData(metrics: ExpenseMetric[]) {
        const total = metrics.reduce((acc, curr) => acc + Number(curr.amount), 0);
        metrics.forEach((metric) => {
            const percentual = (metric.amount / total) * 100;
            expenseData[metric.name] = percentual;
        });
        console.log(expenseData);
    }


    onMount(async () => {
        expenseMetrics = await getExpenseMetrics();
        console.log(expenseMetrics);
    });

    let options: ApexCharts.ApexOptions = {};
    $: calculateData(expenseMetrics);
    $: options = {
        series: Object.values(expenseData),
        chart: {
            height: 420,
            width: '100%',
            type: 'pie'
        },
        stroke: {
            colors: ['white'],
            lineCap: 'butt'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    offset: -25
                }
            }
        },
        labels: Object.keys(expenseData),
        dataLabels: {
            enabled: true,
            style: {
                fontFamily: 'Inter, sans-serif'
            }
        },
        legend: {
            position: 'bottom',
            fontFamily: 'Inter, sans-serif',
            labels: {
                useSeriesColors: true
            }

        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return value + '%';
                },
                style: {
                    fontFamily: 'Inter, sans-serif',
                    colors: 'white'
                }
            }
        },
        xaxis: {
            labels: {
                formatter: function (value) {
                    return value + '%';
                }
            },
            axisTicks: {
                show: false
            },
            axisBorder: {
                show: false
            }
        }
    };
</script>

<Card>
    <div class="flex justify-between items-start w-full">
        <div class="flex-col items-center">
            <div class="flex items-center mb-1">
                <h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white me-1">Expenses Division</h5>
            </div>
        </div>
    </div>

    <Chart {options} class="py-6"/>
</Card>