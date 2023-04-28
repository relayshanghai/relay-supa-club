import React from "react";
import type { InputProps } from "src/components/input";
import { Input } from "src/components/input";
import { TextInput as TextInputUi } from "src/components/ui";
import type { Props as TextInputUiProps } from "src/components/ui/input/TextInput";

type FCProps = {
    [key:string]: any
}

const Input1: React.FunctionComponent<FCProps & InputProps> = (props) => {
    return (
        <Input {...props} />
    )
}

const Input2: React.FunctionComponent<FCProps & TextInputUiProps> = (props) => {
    return (
        <TextInputUi {...props} maximLength={3} />
    )
}

const Input3: React.FunctionComponent<FCProps> = (props) => {
    return (
        <input {...props} type="text" className="input-field" />
    )
}

export type SubInputProps = InputProps | TextInputUiProps

type Props = {
    variant?: "components-input" | "components-ui" | "input-field"
}

const isInputProps = (props: SubInputProps): props is InputProps => {
    return (props as InputProps).label !== undefined
}

const isTextInputUiProps = (props: SubInputProps): props is TextInputUiProps => {
    return (props as TextInputUiProps).fieldName !== undefined &&
    (props as TextInputUiProps).register !== undefined &&
    (props as TextInputUiProps).errors !== undefined
}

type TextInputProps = Props & SubInputProps

/**
 * Wrapper component for the currently existing input components used
 */
const TextInput = ({
    variant = "input-field",
    ...fieldProps
}: TextInputProps) => {

    if (variant === "components-input" && isInputProps(fieldProps)) {
        return <Input1 {...fieldProps} />;
    }

    if (variant === "components-ui" && isTextInputUiProps(fieldProps)) {
        return <Input2 {...fieldProps} />;
    }

    return <Input3 {...fieldProps} />;
}

export default TextInput;
