<script lang="ts">
    type CarouselImage = {
        src: string;
        alt: string;
    };

    const {
        images = [],
        label = "Project screenshots",
    }: {
        images?: CarouselImage[];
        label?: string;
    } = $props();

    let activeIndex = $state(0);
    let totalSlides = $derived(images.length);

    $effect(() => {
        if (totalSlides === 0) {
            activeIndex = 0;
            return;
        }
        if (activeIndex > totalSlides - 1) {
            activeIndex = totalSlides - 1;
        }
    });

    function wrapIndex(index: number): number {
        if (totalSlides === 0) return 0;
        return (index + totalSlides) % totalSlides;
    }

    function goTo(index: number) {
        activeIndex = wrapIndex(index);
    }

    function next() {
        goTo(activeIndex + 1);
    }

    function previous() {
        goTo(activeIndex - 1);
    }

    function onKeyDown(event: KeyboardEvent) {
        if (event.key === "ArrowRight") {
            event.preventDefault();
            next();
        }
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            previous();
        }
    }
</script>

<div
    class="carousel"
    role="region"
    aria-roledescription="carousel"
    aria-label={label}
>
    {#if totalSlides > 0}
        <div class="viewport">
            <div
                class="track"
                style={`--active-index:${activeIndex}; --slide-count:${totalSlides};`}
            >
                {#each images as image, index}
                    <figure class="slide" aria-hidden={index !== activeIndex}>
                        <img
                            src={image.src}
                            alt={image.alt}
                            loading={index === 0 ? "eager" : "lazy"}
                            decoding="async"
                        />
                        <figcaption>{image.alt}</figcaption>
                    </figure>
                {/each}
            </div>

            {#if totalSlides > 1}
                <button
                    class="nav-button prev"
                    type="button"
                    onclick={previous}
                    onkeydown={onKeyDown}
                    aria-label="Previous screenshot"
                >
                    &#8249;
                </button>
                <button
                    class="nav-button next"
                    type="button"
                    onclick={next}
                    onkeydown={onKeyDown}
                    aria-label="Next screenshot"
                >
                    &#8250;
                </button>
            {/if}
        </div>

        {#if totalSlides > 1}
            <div class="dots" role="tablist" aria-label="Screenshot pagination">
                {#each images as image, index}
                    <button
                        type="button"
                        role="tab"
                        aria-label={`Go to screenshot ${index + 1}`}
                        aria-selected={index === activeIndex}
                        class={index === activeIndex ? "active" : ""}
                        onclick={() => goTo(index)}
                        onkeydown={onKeyDown}
                    >
                        <span class="dot-index">{index + 1}</span>
                        <span class="sr-only">{image.alt}</span>
                    </button>
                {/each}
            </div>
        {/if}
    {:else}
        <p class="empty-state">No screenshots available yet.</p>
    {/if}
</div>

<style>
    .carousel {
        width: min(100%, 980px);
        margin-inline: auto;
        border: 1px solid oklch(from var(--color-amber) l c h / 0.16);
        border-radius: 0.35rem;
        background:
            radial-gradient(
                80% 90% at 12% 12%,
                oklch(from var(--color-amber) l c h / 0.08),
                transparent 60%
            ),
            linear-gradient(
                150deg,
                oklch(from var(--color-surface) l c h / 0.9),
                oklch(from var(--color-deep) l c h / 0.95)
            );
        box-shadow:
            0 25px 70px -45px rgba(0, 0, 0, 0.9),
            inset 0 0 0 1px oklch(from var(--color-cream) l c h / 0.04);
        padding: 0.9rem;
    }

    .carousel:focus-visible {
        outline: 1px solid var(--color-amber);
        outline-offset: 5px;
    }

    .viewport {
        position: relative;
        overflow: hidden;
        border-radius: 0.25rem;
        border: 1px solid oklch(from var(--color-cream) l c h / 0.08);
        background: oklch(from var(--color-deep) l c h / 0.85);
    }

    .track {
        --slide-count: 1;
        --active-index: 0;
        display: flex;
        width: calc(var(--slide-count) * 100%);
        transform: translateX(calc(var(--active-index) * -100% / var(--slide-count)));
        transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
    }

    .slide {
        width: calc(100% / var(--slide-count));
        margin: 0;
        position: relative;
        aspect-ratio: 16 / 10;
        overflow: hidden;
        background:
            radial-gradient(
                110% 100% at 85% 8%,
                oklch(from var(--color-amber) l c h / 0.1),
                transparent 55%
            ),
            linear-gradient(
                180deg,
                oklch(from var(--color-surface) l c h / 0.92),
                oklch(from var(--color-deep) l c h / 0.98)
            );
    }

    .slide img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }

    figcaption {
        position: absolute;
        left: 0.75rem;
        right: 0.75rem;
        bottom: 0.75rem;
        font-size: 0.72rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: oklch(from var(--color-cream) l c h / 0.88);
        background: oklch(from var(--color-deep) l c h / 0.55);
        border: 1px solid oklch(from var(--color-cream) l c h / 0.12);
        padding: 0.38rem 0.6rem;
        border-radius: 0.2rem;
        backdrop-filter: blur(2px);
    }

    .nav-button {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        width: 2.4rem;
        height: 2.4rem;
        border: 1px solid oklch(from var(--color-cream) l c h / 0.24);
        border-radius: 999px;
        background: oklch(from var(--color-deep) l c h / 0.65);
        color: oklch(from var(--color-cream) l c h / 0.95);
        font-size: 1.65rem;
        line-height: 1;
        cursor: pointer;
        display: grid;
        place-items: center;
        transition:
            background-color 220ms ease,
            border-color 220ms ease,
            color 220ms ease,
            transform 220ms ease;
        backdrop-filter: blur(3px);
    }

    .nav-button:hover {
        background: oklch(from var(--color-amber) l c h / 0.16);
        border-color: oklch(from var(--color-amber) l c h / 0.45);
        color: var(--color-amber);
    }

    .nav-button:active {
        transform: translateY(-50%) scale(0.96);
    }

    .nav-button.prev {
        left: 0.75rem;
    }

    .nav-button.next {
        right: 0.75rem;
    }

    .dots {
        margin-top: 0.8rem;
        display: flex;
        flex-wrap: wrap;
        gap: 0.38rem;
        justify-content: center;
    }

    .dots button {
        border: 1px solid oklch(from var(--color-cream) l c h / 0.18);
        border-radius: 999px;
        padding: 0.28rem 0.55rem;
        background: oklch(from var(--color-deep) l c h / 0.45);
        color: var(--color-faded);
        font-size: 0.68rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        transition:
            border-color 200ms ease,
            color 200ms ease,
            background-color 200ms ease;
    }

    .dots button:hover {
        border-color: oklch(from var(--color-amber) l c h / 0.4);
        color: var(--color-cream);
    }

    .dots button.active {
        background: oklch(from var(--color-amber) l c h / 0.22);
        border-color: oklch(from var(--color-amber) l c h / 0.5);
        color: var(--color-amber);
    }

    .dot-index {
        font-variant-numeric: tabular-nums;
    }

    .empty-state {
        margin: 0;
        border: 1px dashed oklch(from var(--color-cream) l c h / 0.2);
        border-radius: 0.2rem;
        padding: 1rem;
        color: var(--color-muted);
        text-align: center;
        font-size: 0.95rem;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }

    @media (max-width: 640px) {
        .carousel {
            padding: 0.55rem;
        }

        .nav-button {
            width: 2rem;
            height: 2rem;
            font-size: 1.5rem;
        }

        figcaption {
            font-size: 0.64rem;
        }
    }
</style>
