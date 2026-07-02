"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import Select, { components, OptionProps, SingleValueProps, Props as SelectProps } from "react-select";
import { FieldPath, FieldValues, ControllerRenderProps } from "react-hook-form";

export type CustomOptionProps = {
	value: string | number;
	label: string | number;
	icon: IconDefinition;
};

export interface CustomSelectProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> extends SelectProps<CustomOptionProps, false, never> {
	placeholder?: string;
	name: FieldPath<TFieldValues>;
	field?: ControllerRenderProps<TFieldValues, TName>;
}

const CustomOption = (props: OptionProps<CustomOptionProps, false, never>) => {
	return (
		<components.Option {...props}>
			<div>
				<FontAwesomeIcon
					icon={props.data.icon}
					color="#0b9ebf"
				/>
				<span>{props.data.label}</span>
			</div>
		</components.Option>
	);
};

const CustomSelectedOption = (props: SingleValueProps<CustomOptionProps, false, never>) => {
	return (
		<components.SingleValue {...props}>
			<div>
				<FontAwesomeIcon
					icon={props.data.icon}
					color="#0b9ebf"
					size="xs"
				/>
				<span>{props.data.label}</span>
			</div>
		</components.SingleValue>
	);
};

function IconSelect<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({ options, placeholder, field, className }: CustomSelectProps<TFieldValues, TName>) {
	return (
		<Select
			{...field}
			options={options}
			placeholder={placeholder}
			components={{
				Option: CustomOption,
				SingleValue: CustomSelectedOption,
			}}
			onChange={(val) => field?.onChange(val?.value)}
			value={options?.find((o) => o?.value === field?.value)}
			className={`custom-select ${className}`}
			classNamePrefix="custom-select"
			// unstyled
			// styles={{
			// 	control: (baseStyles, state) => ({
			// 		...baseStyles,
			// 		borderColor: state.isFocused ? "grey" : "red",
			// 	}),
			// }}
		/>
	);
}

export default IconSelect;
