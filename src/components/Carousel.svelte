<script lang="ts">
    import * as Carousel from '@/components/ui/carousel/index';
    import type { CarouselAPI } from '@/components/ui/carousel/context';
    import * as Card from '@/components/ui/card/index';

    export let images: { src: string; alt: string }[];

    let api: CarouselAPI;
    let current = 0;
    let count = 0;

    $: if (api) {
        count = api.scrollSnapList().length;
        current = api.selectedScrollSnap() + 1;

        api.on('select', () => {
            current = api.selectedScrollSnap() + 1;
        });
    }
</script>

<div class="flex flex-col gap-y-2 items-center">
    <Carousel.Root
        bind:api
        opts={{
            loop: true
        }}
        class="w-screen sm:max-w-screen-md"
    >
        <Carousel.Content>
            {#each images as image, i (i)}
                <Carousel.Item>
                    <Card.Root>
                        <Card.Content class="overflow-hidden flex aspect-square items-center justify-center">
                            <img src={image.src} alt={image.alt} />
                        </Card.Content>
                        <small class="pl-6 text-sm text-muted-foreground">{image.alt}</small>
                    </Card.Root>
                </Carousel.Item>
            {/each}
        </Carousel.Content>
        <Carousel.Previous />
        <Carousel.Next />
    </Carousel.Root>
    <div class="pt-4 text-center text-sm text-muted-foreground">
        Image {current} of {count}
    </div>
</div>
