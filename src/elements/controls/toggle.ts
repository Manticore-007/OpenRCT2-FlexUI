import { isObservable } from "@src/bindings/isObservable";
import { Observable } from "@src/bindings/observable";
import { observable } from "@src/bindings/observableConstructor";
import { BuildOutput } from "@src/building/buildOutput";
import { WidgetCreator } from "@src/building/widgetCreator";
import { AbsolutePosition } from "../layouts/absolute/absolutePosition";
import { FlexiblePosition } from "../layouts/flexible/flexiblePosition";
import { Positions } from "../layouts/positions";
import { ButtonControl, ButtonParams } from "./button";


/**
 * The parameters for configuring the toggle button.
 */
export interface ToggleParams extends Omit<ButtonParams, "onClick">
{
	/**
	 * Triggers when the toggle button is pressed down or released.
	 */
	onChange?: (isPressed: boolean) => void;
}


/**
 * Add a button that can be toggled on and off.
 */
export function toggle(params: ToggleParams & FlexiblePosition): WidgetCreator<ToggleParams & FlexiblePosition>;
export function toggle(params: ToggleParams & AbsolutePosition): WidgetCreator<ToggleParams & AbsolutePosition>;
export function toggle(params: ToggleParams & Positions): WidgetCreator<ToggleParams>
{
	return {
		params: params,
		create: (output: BuildOutput): ToggleControl => new ToggleControl(output, params)
	};
}


/**
 * A controller class for a toggle button widget.
 */
class ToggleControl extends ButtonControl implements ButtonWidget, ToggleParams
{
	onChange?: (isPressed: boolean) => void;

	_toggled: Observable<boolean>;

	constructor(output: BuildOutput, params: ToggleParams & ButtonParams)
	{
		// Ensure isPressed is an observable, so we can update
		// the live widget more easily.
		const pressed = params.isPressed;
		const toggled = (isObservable(pressed))
			? pressed : observable(!!pressed);

		params.isPressed = toggled;
		params.onClick = (): void => updateToggle(this);

		super(output, params);
		this._toggled = toggled;
		this.onChange = params.onChange;
	}
}


/**
 * Callback that toggles the button when it gets pressed.
 */
function updateToggle(toggle: ToggleControl): void
{
	const observable = toggle._toggled;
	const newValue = !observable.get();

	observable.set(newValue);
	if (toggle.onChange)
	{
		toggle.onChange(newValue);
	}
}