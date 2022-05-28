import { LitElement } from 'lit';

class LightDomLitElement extends LitElement {
    createRenderRoot(): this {
        return this;
    }
}

export default LightDomLitElement;
