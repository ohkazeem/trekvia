import styles from "@/styles/inputGroup.module.scss";
import * as z from "zod";

interface FormFieldsProps<T extends z.ZodObject> {
	schema?: T;
	data?: z.infer<T>;
	children: React.ReactNode;
	fieldName?: string;
}

export const isRequired = (schema: z.ZodObject | undefined, fieldName: string | undefined): object | undefined => {
	if (fieldName !== undefined) {
		if (!schema?.shape[fieldName].safeParse(undefined).success) {
			return { "aria-required": true };
		}
	}

	return undefined;
};

function InputGroup<T extends z.ZodObject>({ children, schema, fieldName }: FormFieldsProps<T>) {
	const requiredProps = schema?.shape ? isRequired(schema, fieldName) : undefined;
	return (
		<div
			className={styles.inputGroup}
			{...requiredProps}>
			{children}
		</div>
	);
}

export default InputGroup;
