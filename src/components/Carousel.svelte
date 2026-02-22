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
    let fullscreenDialog: HTMLDialogElement | null = null;
    let modalImageIndex = $state<number | null>(null);
    let modalImage = $derived(
        modalImageIndex === null ? null : (images[modalImageIndex] ?? null),
    );
    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartSlideIndex: number | null = null;
    let isPointerActive = false;
    const swipeThreshold = 48;
    const swipeAxisMultiplier = 1.2;
    const tapThreshold = 12;

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
        if (fullscreenDialog?.open) return;

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
        if (event.target instanceof Element) {
            const isControlPress = event.target.closest(
                "[data-carousel-control]",
            );
            if (isControlPress) {
                isPointerActive = false;
                pointerStartSlideIndex = null;
                return;
            }
        }

        pointerStartX = event.clientX;
        pointerStartY = event.clientY;
        isPointerActive = true;
        pointerStartSlideIndex = null;

        const target = event.target;
        if (target instanceof Element) {
            const slideTrigger = target.closest<HTMLElement>("[data-slide-index]");
            if (slideTrigger) {
                const rawIndex = Number.parseInt(
                    slideTrigger.dataset.slideIndex ?? "",
                    10,
                );
                pointerStartSlideIndex = Number.isNaN(rawIndex)
                    ? null
                    : rawIndex;
            }
        }

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

        if (!isHorizontalSwipe) {
            const isTap =
                Math.abs(deltaX) <= tapThreshold &&
                Math.abs(deltaY) <= tapThreshold;

            if (isTap && pointerStartSlideIndex !== null) {
                openFullscreen(pointerStartSlideIndex);
            }
            pointerStartSlideIndex = null;
            return;
        }

        if (deltaX < 0) {
            next();
            pointerStartSlideIndex = null;
            return;
        }

        previous();
        pointerStartSlideIndex = null;
    }

    function onPointerCancel(event: PointerEvent) {
        isPointerActive = false;
        pointerStartSlideIndex = null;

        if (
            event.currentTarget instanceof HTMLElement &&
            event.currentTarget.hasPointerCapture(event.pointerId)
        ) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    function openFullscreen(index: number) {
        if (totalSlides === 0) return;
        modalImageIndex = wrapIndex(index);
        if (!fullscreenDialog?.open) {
            fullscreenDialog?.showModal();
        }
    }

    function closeFullscreen() {
        fullscreenDialog?.close();
        modalImageIndex = null;
    }

    function onDialogClose() {
        modalImageIndex = null;
    }

    function onDialogClick(event: MouseEvent) {
        if (event.currentTarget === event.target) {
            closeFullscreen();
        }
    }

    function isVideoSource(src: string): boolean {
        return /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);
    }

    function getVideoMimeType(src: string): string {
        if (/\.webm(\?.*)?$/i.test(src)) return "video/webm";
        if (/\.ogg(\?.*)?$/i.test(src)) return "video/ogg";
        return "video/mp4";
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
            role="group"
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
                        <button
                            type="button"
                            class="slide-media"
                            onclick={() => openFullscreen(index)}
                            data-slide-index={index}
                            aria-label={`Open ${image.alt} in fullscreen`}
                        >
                            {#if isVideoSource(image.src)}
                                <video
                                    muted
                                    autoplay
                                    loop
                                    playsinline
                                    preload={index === activeIndex ? "metadata" : "none"}
                                    aria-label={image.alt}
                                >
                                    <source
                                        src={image.src}
                                        type={getVideoMimeType(image.src)}
                                    />
                                    {image.alt}
                                </video>
                            {:else}
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    loading={index === 0 ? "eager" : "lazy"}
                                    decoding="async"
                                />
                            {/if}
                        </button>
                        <figcaption>{image.alt}</figcaption>
                    </figure>
                {/each}
            </div>

            {#if totalSlides > 1}
                <button
                    class="nav-button prev"
                    type="button"
                    onclick={previous}
                    data-carousel-control
                    aria-label="Previous"
                >
                    &#8249;
                </button>
                <button
                    class="nav-button next"
                    type="button"
                    onclick={next}
                    data-carousel-control
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

<dialog
    class="carousel-modal"
    bind:this={fullscreenDialog}
    onclose={onDialogClose}
    onclick={onDialogClick}
    aria-label={modalImage?.alt ?? "Fullscreen image preview"}
>
    {#if modalImage}
        <button
            type="button"
            class="modal-close"
            onclick={closeFullscreen}
            aria-label="Close fullscreen preview"
        >
            <span aria-hidden="true">&#10005;</span>
        </button>
        <figure class="modal-figure">
            {#if isVideoSource(modalImage.src)}
                <video controls autoplay playsinline aria-label={modalImage.alt}>
                    <source
                        src={modalImage.src}
                        type={getVideoMimeType(modalImage.src)}
                    />
                    {modalImage.alt}
                </video>
            {:else}
                <img src={modalImage.src} alt={modalImage.alt} />
            {/if}
            <figcaption>{modalImage.alt}</figcaption>
        </figure>
    {/if}
</dialog>

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
        border: 0;
        padding: 0;
        width: 100%;
        cursor: zoom-in;
        display: block;
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

    .slide-media:focus-visible {
        outline: 1px solid var(--color-amber);
        outline-offset: -1px;
    }

    .slide-media img,
    .slide-media video {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        display: block;
    }

    .carousel-modal {
        width: min(100vw, 1200px);
        max-width: calc(100vw - 1rem);
        max-height: calc(100dvh - 1rem);
        margin: auto;
        border: 1px solid oklch(from var(--color-amber) l c h / 0.26);
        border-radius: 0.32rem;
        padding: 0;
        overflow: hidden;
        background:
            linear-gradient(
                135deg,
                oklch(from var(--color-surface) l c h / 0.96),
                oklch(from var(--color-deep) l c h / 0.96)
            );
        box-shadow:
            0 40px 120px -50px rgba(0, 0, 0, 0.9),
            inset 0 0 0 1px oklch(from var(--color-cream) l c h / 0.08);
    }

    .carousel-modal::backdrop {
        background:
            radial-gradient(
                circle at 16% 18%,
                oklch(from var(--color-amber) l c h / 0.22),
                transparent 45%
            ),
            rgba(2, 4, 6, 0.85);
        backdrop-filter: blur(6px);
    }

    .modal-figure {
        margin: 0;
        display: flex;
        flex-direction: column;
        max-height: calc(100dvh - 1rem);
    }

    .modal-figure img,
    .modal-figure video {
        width: 100%;
        flex: 1 1 auto;
        min-height: 0;
        object-fit: contain;
        display: block;
    }

    .modal-figure figcaption {
        font-size: 0.68rem;
        line-height: 1.45;
        letter-spacing: 0.03em;
        text-transform: none;
        overflow-wrap: anywhere;
        white-space: normal;
        color: var(--color-faded);
        background: oklch(from var(--color-deep) l c h / 0.45);
        border-top: 1px solid oklch(from var(--color-cream) l c h / 0.12);
        padding: 0.7rem 0.9rem 0.72rem;
    }

    .modal-close {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        z-index: 2;
        width: 2rem;
        height: 2rem;
        border: 1px solid oklch(from var(--color-cream) l c h / 0.26);
        border-radius: 999px;
        background: oklch(from var(--color-deep) l c h / 0.7);
        color: oklch(from var(--color-cream) l c h / 0.95);
        display: grid;
        place-items: center;
        font-size: 0;
        cursor: pointer;
        transition:
            border-color 180ms ease,
            background-color 180ms ease,
            color 180ms ease;
    }

    .modal-close span {
        width: 100%;
        height: 100%;
        display: grid;
        place-items: center;
        font-size: 1.45rem;
        line-height: 1;
        transform: translateY(-0.03em);
    }

    .modal-close:hover {
        border-color: oklch(from var(--color-amber) l c h / 0.5);
        background: oklch(from var(--color-amber) l c h / 0.24);
        color: var(--color-amber);
    }

    .modal-close:focus-visible {
        outline: 1px solid var(--color-amber);
        outline-offset: 2px;
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

        .carousel-modal {
            max-width: calc(100vw - 0.3rem);
            max-height: calc(100dvh - 0.3rem);
            border-radius: 0.22rem;
        }

        .modal-figure figcaption {
            font-size: 0.56rem;
            line-height: 1.35;
            padding: 0.45rem 0.5rem 0.52rem;
        }

        .modal-close {
            width: 1.7rem;
            height: 1.7rem;
            top: 0.35rem;
            right: 0.35rem;
        }

        .modal-close span {
            font-size: 1.25rem;
        }
    }
</style>
