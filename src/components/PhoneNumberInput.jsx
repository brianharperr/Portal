import { Input } from "@mui/joy"
import { forwardRef } from "react";
import { IMaskInput } from "react-imask";

const TextMaskAdapter = forwardRef(function TextMaskAdapter(props, ref) {
    const { onChange, ...other } = props;

    return (
      <IMaskInput
        {...other}
        mask="(#00) 000-0000"
        definitions={{
          "#": /[1-9]/,
        }}
        inputRef={ref}
        onAccept={(value) => onChange({ target: { name: props.name, value } })}
        overwrite
      />
    );
});

export default function PhoneNumberInput({value, onChange})
{

    return (
        <Input
            value={value}
            onChange={onChange}
            slotProps={{ input: { component: TextMaskAdapter } }}
        />
    )
}