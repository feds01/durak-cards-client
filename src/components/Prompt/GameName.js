import React from 'react';
import {Form, Formik} from "formik";
import Loader from 'react-loader-spinner';
import Button from "@material-ui/core/Button";
import {checkName} from "../../utils/networking";
import Input from "../Input";
import * as Yup from "yup";


const NameSchema = Yup.object().shape({
    name: Yup.string()
        .trim("Name cannot have spaces.")
        .strict()
        .matches(/^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/, "Name cannot have spaces.")
        .max(20, "Name too long")
        .required("Name can't be empty")
});

const GameName = (props) => {
    return (
        <Formik
            initialValues={{name: ''}}
            validateOnChange={false}
            validationSchema={NameSchema}
            onSubmit={async (values, {setSubmitting, setErrors}) => {
                // make a request to the API to check if there is a game with the given pin,
                // and if so we'll set the next stage of the prompt (enter the pin).
                const nameCheck = await checkName(props.pin, values.name)

                if (!nameCheck.status) {
                    setErrors({name: "Name already taken."});
                } else {
                    setSubmitting(false);
                    props.onSuccess(values.name);
                }
            }}
        >
            {props => {
                const {
                    values,
                    errors,
                    isSubmitting,
                    handleSubmit,
                    handleChange
                } = props;

                return (
                    <Form>
                        <div className={'Prompt'}>
                            <Input
                                id={'name'}
                                placeholder={'Enter name'}
                                autoFocus
                                autoComplete={"off"}
                                error={Boolean(errors.name)}
                                helperText={errors.name || ""}
                                value={values.name}
                                onChange={handleChange}
                            />
                            <Button
                                variant={'contained'}
                                className={'Prompt-enter'}
                                disableElevation
                                style={{
                                    marginTop: 19
                                }}
                                disableRipple
                                type={"submit"}
                                disabled={isSubmitting}
                                onClick={handleSubmit}
                                color={'primary'}
                            >
                                {isSubmitting ?
                                    <Loader type="ThreeDots" color="#FFFFFF" height={20} width={40}/> : "Enter"}
                            </Button>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default GameName;
