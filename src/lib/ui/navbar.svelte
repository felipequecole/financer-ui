<script>
    import {
        Navbar,
        NavBrand,
        NavLi,
        NavUl,
        NavHamburger
    } from 'flowbite-svelte';
    import {DarkMode} from 'flowbite-svelte';
    import Icon from 'svelte-icons-pack/Icon.svelte';
    import RiFinanceMoneyDollarCircleFill from "svelte-icons-pack/ri/RiFinanceMoneyDollarCircleFill";

    const btnClass = 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-0.5'
</script>

<Navbar class="px-2 sm:px-4 py-2.5 fixed w-full z-20 top-0 start-0 border-b">
    <NavBrand href="/">
        <Icon src="{RiFinanceMoneyDollarCircleFill}" className="fill-current" size="1.0em"/>
        <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white px-1">Financer</span>
    </NavBrand>
    <NavHamburger/>
    <NavUl>
<!--        <NavLi href="/" active={true}>Home</NavLi>-->
        <NavLi href="/month">Months</NavLi>
        <NavLi href="/expenses">Expenses</NavLi>
        <!--        <NavLi href="/pricing">Pricing</NavLi>-->
        <!--        <NavLi href="/contact">Contact</NavLi>-->
        <DarkMode size="md" {btnClass}/>
    </NavUl>
</Navbar>
