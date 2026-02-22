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
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isPointerActive = false;
    const swipeThreshold = 48;
    const swipeAxisMultiplier = 1.2;

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

    function onPointerDown(event: PointerEvent) {
        if (event.pointerType === "mouse" && event.button !== 0) return;

        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        isPointerActive = true;

        if (event.currentTarget instanceof HTMLElement) {
            event.currentTarget.setPointerCapture(event.pointerId);
        }
    }

    function onPointerUp(event: PointerEvent) {
        if (!isPointerActive) return;
        isPointerActive = false;

        if (
            event.currentTarget instanceof HTMLElement &&
            event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }

        const deltaX = event.clientX - pointerStartX;
        const deltaY = event.clientY - pointerStartY;
        const isHorizontalSwipe =
            Math.abs(deltaX) >= swipeThreshold &&
            Math.abs(deltaX) > Math.abs(deltaY) * swipeAxisMultiplier;

        if (!isHorizontalSwipe) return;

        if (deltaX < 0) {
            next();
            return;
        }

        previous();
    }

    function onPointerCancel(event: PointerEvent) {
        isPointerActive = false;

        if (
            event.currentTarget instanceof HTMLElement &&
            event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }
</script>

<svelte:document onkeydown={onKeyDown} />

<div
    class="carousel"
    role="region"
    aria-roledescription="carousel"
    aria-label={label}
>
    {#if totalSlides > 0}
        <div
            class="viewport"
            onpointerdown={onPointerDown}
            onpointerup={onPointerUp}
            onpointercancel={onPointerCancel}
        >
            <div
                class="track"
                style={`--active-index:${activeIndex};`}
            >
                {#each images as image, index}
                    <figure class="slide" aria-hidden={index !== activeIndex}>
                        <div class="slide-media">
                            <img
                                src={image.src}
                                alt={image.alt}
                                loading={index === 0 ? "eager" : "lazy"}
                                decoding="async"
                            />
                        </div>
                        <figcaption>{image.alt}</figcaption>
                    </figure>
                {/each}
            </div>

            {#if totalSlides > 1}
                <button
                    class="nav-button prev"
                    type="button"
                    onclick={previous}
                    aria-label="Previous"
                >
                    &#8249;
                </button>
                <button
                    class="nav-button next"
                    type="button"
                    onclick={next}
                    aria-label="Next"
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
        touch-action: pan-y pinch-zoom;
    }

    .track {
        --active-index: 0;
        display: flex;
        transform: translateX(calc(var(--active-index) * -100%));
        transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
    }

    .slide {
        flex: 0 0 100%;
        margin: 0;
        display: flex;
        flex-direction: column;
    }

    .slide-media {
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

    .slide-media img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        display: block;
    }

    figcaption {
        margin: 0;
        font-size: 0.72rem;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: oklch(from var(--color-faded) l c h / 0.9);
        background: oklch(from var(--color-deep) l c h / 0.35);
        border-top: 1px solid oklch(from var(--color-cream) l c h / 0.1);
        padding: 0.55rem 0.6rem 0.58rem;
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
        width: 2.4rem;
        height: 2.4rem;
        padding: 0;
        display: inline-grid;
        place-items: center;
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
        line-height: 1;
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
            width: 100%;
            padding: 0.24rem;
            border-radius: 0.28rem;
        }

        .viewport {
            border-radius: 0.18rem;
        }

        .nav-button {
            width: 1.65rem;
            height: 1.65rem;
            font-size: 1.2rem;
        }

        .nav-button.prev {
            left: 0.35rem;
        }

        .nav-button.next {
            right: 0.35rem;
        }

        .dots {
            margin-top: 0.5rem;
            gap: 0.24rem;
        }

        .dots button {
            width: 1.85rem;
            height: 1.85rem;
            font-size: 0.56rem;
        }

        figcaption {
            font-size: 0.58rem;
            padding: 0.42rem 0.46rem 0.46rem;
        }
    }
</style>
