import { Button, Stack, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useForm, FieldValues } from "react-hook-form";
interface FormInputs {
  text: string;
}

const TextInput = (props: { onSubmit: any }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();
  return (
    <Stack
      direction="row"
      spacing={2}
      component="form"
      onSubmit={handleSubmit(props.onSubmit)}
      noValidate
      width={"90%"}
      paddingTop="8px"
    >
      <TextField
        id="standard-basic"
        label="text"
        variant="standard"
        {...register("text", { required: true })}
        error={errors.text ? true : false}
        autoFocus
        multiline
        fullWidth
        onKeyUp={(e) => {
          if (
            e.key.toLocaleLowerCase() === "enter" &&
            (e.ctrlKey || e.metaKey)
          ) {
            handleSubmit(props.onSubmit);
          }
        }}
      />
      <Button variant="contained" color="primary" type="submit">
        <SendIcon />
      </Button>
    </Stack>
  );
};

export default TextInput;
