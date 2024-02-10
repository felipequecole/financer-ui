import {env} from "$env/dynamic/public";

const graph_ql_endpoint: string | undefined = env.PUBLIC_GRAPHQL_ENDPOINT;

type MonthMetric = {
    monthName: string;
    monthSlug: string;
    incomeTotal: number;
    billTotal: number;
}

type ExpenseMetric = {
    name: string;
    amount: number;
}

function parseMonthResult(result: any) {
    const months = result.data.allMonths.nodes;
    const monthMetrics = months.map((month: any) => {
        const date = new Date()
        date.setMonth(month.month - 1)
        const monthName = date.toLocaleString('default', {month: 'short'});
        const monthSlug = month.slug;
        const incomes = month.incomesByMonthId.nodes;
        const bills = month.billsByMonthId.nodes;
        const incomeTotal = incomes.reduce((acc: number, income: any) => {
            return acc + Number(income.amount);
        }, 0);
        const billTotal = bills.reduce((acc: number, bill: any) => {
            return acc + Number(bill.amount);
        }, 0);
        return {
            monthName,
            monthSlug,
            incomeTotal,
            billTotal
        }
    });
    return monthMetrics;
}

function parseExpenseResult(result: any) {
    const expenses = result.data.allExpenses.nodes;
    const expenseMetrics = expenses.map((expense: any) => {
        const name = expense.name;
        const amount = expense.amount;
        return {
            name,
            amount
        }
    });
    return expenseMetrics;

}

async function runGraphQlQuery(query: string) {
    if (graph_ql_endpoint) {
        const results = await fetch(graph_ql_endpoint, {
            method: 'POST',

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                query
            })
        })
        return await results.json();
    }
}

async function getMonthMetricGraphQl(orderBy: string) {
    const query = `{
    allMonths(first: 12, orderBy: [${orderBy}]) {
        nodes {
            slug
            month
            year
            incomesByMonthId(first: 10) {
                nodes {
                    amount
                    name
                }
            }
            billsByMonthId(first: 100) {
                nodes {
                    name
                    amount
                }
            }
        }
    }
}`
    return await runGraphQlQuery(query);
}

async function getExpenseMetricGraphQl() {
    const query = `{
     allExpenses(condition: { active: true }, first: 100) {
        totalCount
        nodes {
            name
            amount
        }
    }
}`
    return await runGraphQlQuery(query);
}

async function getMonthExpenseMetrics(orderBy: string) {
    const result = await getMonthMetricGraphQl(orderBy);
    console.log(result.data)
    return parseMonthResult(result);
}

async function getExpenseMetrics(): Promise<ExpenseMetric[]> {
    const result = await getExpenseMetricGraphQl();
    console.log(result.data);
    return parseExpenseResult(result);
}

export {
    getMonthExpenseMetrics,
    getExpenseMetrics,
    type MonthMetric,
    type ExpenseMetric,
}