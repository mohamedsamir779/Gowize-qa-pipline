import React from "react";
import {
  Input,
  FormFeedback,
  InputGroup
} from "reactstrap";
/**
 * A custom bootstrap input component to use with a formik field
 * @param field
 * @param touched
 * @param errors
 * @param props
 * @returns {*}
 * @constructor
 */
export const CustomInput = ({
  field,  // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <InputGroup>
    {props.inputgrouptext}
    <Input
      invalid={!!(touched[field.name] && errors[field.name])}
      {...field}
      {...props} />
    {touched[field.name] && errors[field.name] && <FormFeedback>{errors[field.name]}</FormFeedback>}
    {props.rightinputgrouptext}
  </InputGroup>
);

export const InlineInput = ({
  field,  // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) => (
  <InputGroup className="d-inline">
    <Input
      className="me-1"
      invalid={!!(touched[field.name] && errors[field.name])}
      {...field}
      {...props} />
    {touched[field.name] && errors[field.name] && <FormFeedback>{errors[field.name]}</FormFeedback>}
  </InputGroup>
);
