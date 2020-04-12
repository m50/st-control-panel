import React, { useState, useEffect } from 'react';
import { ReactComponent as ErrorIcon } from '../../zondicons/close-outline.svg';
import { ReactComponent as SuccessIcon } from '../../zondicons/checkmark-outline.svg';
import { ReactComponent as NoticeIcon } from '../../zondicons/information-outline.svg';
import { ReactComponent as WarningIcon } from '../../zondicons/exclamation-outline.svg';
import { ValidationErrors } from '../../../spamtitan/types';
import { SVG } from '../../../types';

export enum SuccessLevel {
  error = "border-red-300 text-red-600 bg-red-100",
  warning = "border-yellow-500 text-yellow-900 bg-yellow-100",
  success = "border-green-300 text-green-600 bg-green-100",
  notice = "border-blue-300 text-blue-600 bg-blue-100",
}

export type NoticeType = string | string[] | ValidationErrors;

function arrayifyNoticeType(notice: NoticeType): string[] {
  if (isValidationErrors(notice)) {
    notice = Object.values(notice).flat();
  } else if (typeof notice === 'string') {
    notice = [notice];
  }

  return notice;
}

export function isValidationErrors(notices: NoticeType): notices is ValidationErrors {
  return !Array.isArray(notices) && typeof notices !== 'string';
}

export function appendNotice(notices: NoticeType, newNotice: NoticeType): NoticeType {
  const firstNotices = arrayifyNoticeType(notices);

  return firstNotices.concat(arrayifyNoticeType(newNotice));
}

interface Props {
  errors: NoticeType,
  successLevel?: SuccessLevel
}

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
    let errArray: string[] = arrayifyNoticeType(props.errors);
    setErrors(
      errArray
        .filter(err => err.length > 0)
        .filter((item, idx) => errArray.indexOf(item) === idx)
        .map(err => ({ icon: noticeIcon, error: err }))
    );
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
