import React from 'react';
import { ReactComponent as ErrorIcon } from '../../zondicons/close-solid.svg';
import { ValidationErrors } from '../../../spamtitan/types';

interface Props {
  errors: string[] | ValidationErrors,
}

export function isValidationErrors(errors: string[] | ValidationErrors): errors is ValidationErrors {
  return !Array.isArray(errors);
}

export const ErrorBlock: React.FC<Props> = (props: Props) => {
  let errArray: string[] = [];
  if (isValidationErrors(props.errors)) {
    errArray = Object.values(props.errors).flat();
  } else {
    errArray = props.errors;
  }
  const errors = errArray.filter((err) => err.length > 0);
  return (
    <small className={
      "p-2 text-red-600 text-sm mt-5 bg-red-100 border border-red-300 rounded " +
      (errors.length > 0 ? 'block' : 'hidden')
    }>
      <ul className="">
        {errors.map((error, i) => {
          return <li key={i}><ErrorIcon className="fill-current w-3 h-3 inline-block" /> {error}</li>;
        })}
      </ul>
    </small>
  );
}
