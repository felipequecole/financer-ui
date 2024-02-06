<script lang="ts">
    import {page} from '$app/stores';
    import {Img} from 'flowbite-svelte'

    let message: string | undefined = undefined;
    let status: number | undefined = undefined;
    let type: string | undefined = undefined;
    page.subscribe((value) => {
        if (value.error) {

            message = value.error.message;
            type = value.error.type;
        }
        status = value.status;
    });
</script>

<h1 class="mt-[-5] text-5xl font-medium text-gray-900 dark:text-white text-center">{message}</h1>

<div class="flex mx-auto justify-center mt-5">
    {#if status === 404}
        <Img
                size="max-w-md"
                alignment="mx-auto"
                src="https://source.unsplash.com/K4mSJ7kc0As"
                alt="not found image"
                figClass="relative max-w-sm transition-all duration-300 cursor-pointer filter grayscale hover:grayscale-0"
                captionClass="absolute text-center top-10 px-8 text-6xl text-black rounded-lg"
                caption="Where is the page?"
        />
    {/if}

</div>

