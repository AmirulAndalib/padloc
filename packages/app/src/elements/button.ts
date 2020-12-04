import { shared, mixins } from "../styles";
import { BaseElement, element, html, css, property, listen } from "./base";
import "./icon";
import "./spinner";

type ButtonState = "idle" | "loading" | "success" | "fail";

@element("pl-button")
export class Button extends BaseElement {
    @property({ reflect: true })
    state: ButtonState = "idle";
    @property()
    noTab: boolean = false;

    private _stopTimeout: number;

    static styles = [
        shared,
        css`
            :host {
                display: block;
                font-weight: bold;
            }

            :host([state="loading"]) button {
                cursor: progress;
            }

            button {
                background: transparent;
                position: relative;
                width: 100%;
                box-sizing: border-box;
                height: auto;
                padding: 0.7em;
                background: var(--color-shade-1);
                border-radius: 0.5em;
                border: solid 1px var(--color-shade-2);
                border-bottom-width: 3px;
            }

            :host(.transparent) button {
                background: none;
                border: none;
            }

            :host(.round) button {
                border-radius: 100%;
            }

            :host(.primary) button {
                background: var(--color-highlight);
                color: var(--color-background);
            }

            button > * {
                transition: transform 0.2s cubic-bezier(1, -0.3, 0, 1.3), opacity 0.2s;
                will-change: transform;
            }

            button > :not(.label) {
                ${mixins.absoluteCenter()}
            }

            button > .label {
                display: flex;
                align-items: center;
                justify-content: center;
            }

            :host(.vertical) .label {
                flex-direction: column;
            }

            button.loading .label,
            button.success .label,
            button.fail .label,
            button:not(.loading) .spinner,
            button:not(.success) .icon-success,
            button:not(.fail) .icon-fail {
                opacity: 0.5;
                transform: scale(0);
            }

            button pl-icon {
                font-size: 120%;
            }

            pl-spinner {
                width: 30px;
                height: 30px;
            }
        `,
    ];

    render() {
        const { state, noTab } = this;
        return html`
            <button type="button" class="${state} tap" tabindex="${noTab ? "-1" : ""}">
                <div class="label"><slot></slot></div>

                <pl-spinner .active="${state == "loading"}" class="spinner"></pl-spinner>

                <pl-icon icon="check" class="icon-success"></pl-icon>

                <pl-icon icon="cancel" class="icon-fail"></pl-icon>
            </button>
        `;
    }

    static get is() {
        return "pl-button";
    }

    @listen("click")
    _click(e: MouseEvent) {
        if (this.state === "loading") {
            e.stopPropagation();
        }
    }

    start() {
        clearTimeout(this._stopTimeout);
        this.state = "loading";
    }

    stop() {
        this.state = "idle";
    }

    success() {
        this.state = "success";
        this._stopTimeout = window.setTimeout(() => this.stop(), 1000);
    }

    fail() {
        this.state = "fail";
        this._stopTimeout = window.setTimeout(() => this.stop(), 1000);
    }
}