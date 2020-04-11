import React, { useState, useEffect } from 'react';
import { ReactComponent as ErrorIcon } from '../../zondicons/close-outline.svg';
import { ReactComponent as SuccessIcon } from '../../zondicons/checkmark-outline.svg';
import { ReactComponent as NoticeIcon } from '../../zondicons/information-outline.svg';
import { ReactComponent as WarningIcon } from '../../zondicons/exclamation-outline.svg';
import { ValidationErrors } from '../../../spamtitan/types';

export enum SuccessLevel {
  error = "border-red-300 text-red-600 bg-red-100",
  warning = "border-yellow-500 text-yellow-900 bg-yellow-100",
  success = "border-green-300 text-green-600 bg-green-100",
  notice = "border-blue-300 text-blue-600 bg-blue-100",
}

interface Props {
  errors: string | string[] | ValidationErrors,
  successLevel?: SuccessLevel
}

export function isValidationErrors(errors: string | string[] | ValidationErrors): errors is ValidationErrors {
  return !Array.isArray(errors) && typeof errors !== 'string';
}

type SVG = React.FC<React.SVGProps<SVGSVGElement> & { title?: string | undefined; }>;

export const Notice: React.FC<Props> = (props: Props) => {
  const [noticeIcon, setNoticeIcon] = useState<SVG>(ErrorIcon);
  const [errors, setErrors] = useState<{ icon: SVG, error: string }[]>([]);

  useEffect(() => {
    if (props.successLevel === SuccessLevel.success) {
      setNoticeIcon(SuccessIcon);
    } else if (props.successLevel === SuccessLevel.notice) {
      setNoticeIcon(NoticeIcon);
    } else if (props.successLevel === SuccessLevel.warning) {
      setNoticeIcon(WarningIcon);
    } else {
      setNoticeIcon(ErrorIcon);
    }
  }, [props.successLevel]);

  useEffect(() => {
    let errArray: string[] = [];
    if (isValidationErrors(props.errors)) {
      errArray = Object.values(props.errors).flat();
    } else if (typeof props.errors === 'string') {
      errArray = [props.errors];
    } else {
      errArray = props.errors;
    }
    setErrors(errArray.filter((err) => err.length > 0).map((err) => {
      return { icon: noticeIcon, error: err };
    }));
  }, [props.errors, noticeIcon]);

  return (
    <small className={
      "p-2 text-lg mt-5 border rounded " +
      (props.successLevel ?? SuccessLevel.error) + " " +
      (errors.length > 0 ? 'block' : 'hidden')
    }>
      <ul>
        {errors.map((error, i) => (
          <li key={i}><error.icon title="Notice icon" className="fill-current w-4 h-4 inline-block" /> {error.error}</li>
        ))}
      </ul>
    </small>
  );
}
