<script lang="ts">
    import * as Carousel from '@/components/ui/carousel/index';
    import * as Card from '@/components/ui/card/index';

    // export let images: string[] = [];
</script>

<Carousel.Root class="w-full max-w-xs">
    <Carousel.Content>
        {#each Array(5) as _, i (i)}
            <Carousel.Item>
                <div class="p-1">
                    <Card.Root>
                        <Card.Content class="flex aspect-square items-center justify-center p-6">
                            <span class="text-4xl font-semibold">{i + 1}</span>
                        </Card.Content>
                    </Card.Root>
                </div>
            </Carousel.Item>
        {/each}
    </Carousel.Content>
    <Carousel.Previous />
    <Carousel.Next />
</Carousel.Root>
