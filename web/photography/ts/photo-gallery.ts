import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import LightDomLitElement from './light-dom-lit-element';
import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import createJustifiedLayout from 'justified-layout';

interface ImageType {
    url: string;
    fullUrl: string;
    width: number;
    height: number;
    description: string;
}

@customElement('photo-gallery')
class PhotoGallery extends LightDomLitElement {
    @property({ type: Array })
    images: Array<ImageType>;

    @state()
    private _width: number;

    private __selected = -1;

    set _selected(val: number) {
        const oldVal = this.__selected;
        this.__selected = Math.floor(val);
        this.requestUpdate('_selected', oldVal);

        if (val === -1) {
            document.getElementsByTagName('body')[0].classList.remove('noscroll');
        } else {
            document.getElementsByTagName('body')[0].classList.add('noscroll');
        }
    }

    @state()
    get _selected(): any {
        return this.__selected;
    }

    defaultWidth = 1060;

    leftArrowHtml: string;
    rightArrowHtml: string;
    closeHtml: string;

    cdnUrl = 'https://cdn.jkomskis.com/uploads/';

    constructor() {
        super();
        this.images = new Array<ImageType>();

        library.add(faArrowRight, faTimes);

        const iconSize = 32;
        this.leftArrowHtml = icon(
            { prefix: 'fas', iconName: 'arrow-right' },
            {
                transform: {
                    size: iconSize,
                },
            },
        ).html[0];
        this.rightArrowHtml = icon(
            { prefix: 'fas', iconName: 'arrow-right' },
            {
                transform: {
                    size: iconSize,
                },
            },
        ).html[0];
        this.closeHtml = icon(
            { prefix: 'fas', iconName: 'times' },
            {
                transform: {
                    size: iconSize,
                },
            },
        ).html[0];

        this._width = this.defaultWidth;
        this._selected = -1;

        this.handleResize = this.handleResize.bind(this);
    }

    connectedCallback(): void {
        super.connectedCallback();
        addEventListener('resize', this.handleResize);
        this.handleResize();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        removeEventListener('resize', this.handleResize);
    }

    handleResize(): void {
        this._width = document.getElementsByTagName('main')[0]?.offsetWidth || this.defaultWidth;
    }

    calculateLayout(): any {
        const layoutGeometry = createJustifiedLayout(
            this.images.map((image) => {
                return {
                    width: image.width,
                    height: image.height,
                };
            }),
            {
                containerWidth: this._width,
                containerPadding: 0,
            },
        );
        return layoutGeometry;
    }

    renderImages(): any {
        // top:${layout.boxes[idx].top}px;left:${layout.boxes[idx].left}px;
        const layout = this.calculateLayout();
        console.log(layout);
        return html`<div style="height:${layout.containerHeight}px;">
            ${this.images.map((image, idx) => {
                return html` <img
                    class="album__picture"
                    src="${image.url}"
                    alt="${image.description}"
                    width=${layout.boxes[idx].width}
                    height=${layout.boxes[idx].height}
                    style="position:absolute;transform:translate(${layout.boxes[idx].left}px, ${layout.boxes[idx]
                        .top}px)"
                    loading="lazy"
                    decoding="async"
                    @click=${() => (this._selected = idx)}
                />`;
            })}
        </div>`;
    }

    renderSelectedImage(): any {
        if (this._selected === -1) {
            return html``;
        }

        return html`<div>
            <div class="album__selected-image-background"></div>
            <button class="album__selected-image-close" @click=${() => (this._selected = -1)}>
                ${unsafeHTML(this.closeHtml)}
            </button>
            <button
                class="album__selected-image-prev"
                ?disabled=${this._selected === 0}
                @click=${() => (this._selected = this._selected - 1)}
            >
                ${unsafeHTML(this.leftArrowHtml)}
            </button>
            <button
                class="album__selected-image-next"
                ?disabled=${this._selected === this.images.length - 1}
                @click=${() => (this._selected = this._selected + 1)}
            >
                ${unsafeHTML(this.rightArrowHtml)}
            </button>
            <img
                class="album__fullpicture"
                src="${this.images[this._selected].fullUrl}"
                alt="${this.images[this._selected].description}"
                loading="lazy"
                decoding="async"
            />
        </div>`;
    }

    render(): any {
        return html`
            <div id="gallery" class="album__wrapper${this._selected === -1 ? '' : '--noscroll'}" height="">
                ${this.renderSelectedImage()} ${this.renderImages()}
            </div>
        `;
    }
}

export default PhotoGallery;
