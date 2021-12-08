import { BuildOutput } from "@src/building/buildOutput";
import { WidgetCreator } from "@src/building/widgetCreator";
import { Bindable } from "@src/observables/bindable";
import { ElementParams } from "../element";
import { AbsolutePosition } from "../layouts/absolute/absolutePosition";
import { FlexiblePosition } from "../layouts/flexible/flexiblePosition";
import { Positions } from "../layouts/positions";
import { Control } from "./control";


/**
 * The parameters for configuring the button.
 */
export interface ButtonParams extends ElementParams
{
	/**
	 * The text on the button.
	 */
	text?: Bindable<string>;

	/**
	 * The id of a sprite to use as image.
	 * @default undefined
	 */
	image?: Bindable<number>;

	/**
	 * Whether the button starts off being pressed or not.
	 * @default false
	 */
	isPressed?: Bindable<boolean>;

	/**
	 * Triggers when the button is pressed.
	 */
	onClick?: () => void;
}


/**
 * Create a clickable button that can perform an action.
 */
export function button(params: ButtonParams & FlexiblePosition): WidgetCreator<ButtonParams & FlexiblePosition>;
export function button(params: ButtonParams & AbsolutePosition): WidgetCreator<ButtonParams & AbsolutePosition>;
export function button(params: ButtonParams & Positions): WidgetCreator<ButtonParams & Positions>
{
	return {
		params: params,
		create: (output: BuildOutput): ButtonControl => new ButtonControl(output, params)
	};
}


/**
 * A controller class for a button widget.
 */
export class ButtonControl extends Control<ButtonWidget> implements ButtonWidget, ButtonParams
{
	text?: string;
	image?: number;
	isPressed?: boolean;
	onClick?: () => void;


	constructor(output: BuildOutput, params: ButtonParams)
	{
		super("button", output, params);

		const binder = output.binder;
		binder.add(this, "text", params.text);
		binder.add(this, "image", params.image);
		binder.add(this, "isPressed", params.isPressed);
		this.onClick = params.onClick;
	}
}