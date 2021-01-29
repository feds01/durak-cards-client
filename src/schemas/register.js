import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    token: Yup.string().required("Captcha not completed or expired"),
    name: Yup.string()
        .matches(/^[^\s]{1,20}$/, "Name cannot have spaces")
        .max(20, "Name too long")
        .required('Required'),
    password: Yup.string()
        .min(8, "Password too short")
        .max(30, "Password too long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/, "Password must include a special character, one uppercase character, and a number")
        .required('Required'),
});

export default RegisterSchema;
