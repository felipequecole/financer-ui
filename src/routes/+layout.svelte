<script>
    import '../app.pcss';
    import Navbar from '$lib/ui/navbar.svelte'
</script>

<svelte:head>
    <title>Financer App</title>
    <meta name="robots" content="noindex nofollow"/>
</svelte:head>


<Navbar/>
<div class="container mx-auto pt-20 dark:text-white">
    <slot/>
</div>
