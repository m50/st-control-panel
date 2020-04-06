import React, { useState, useRef, useEffect } from 'react';
import { AuthStatusProps } from '../../types';
import { ReactComponent as UserIcon } from '../zondicons/user-solid-circle.svg';
import { ReactComponent as LogoutIcon } from '../zondicons/travel-walk.svg';
import { initAuthStatus } from '../../App';

interface Props extends AuthStatusProps { }

export const UserDropdown: React.FunctionComponent<Props> = (props: Props) => {
  const [popUpVisible, setPopUpVisisble] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (buttonRef.current && dropDownRef.current) {
        if (buttonRef.current.contains(event.target as Node) || dropDownRef.current.contains(event.target as Node)) {
          return;
        }
      }
      setPopUpVisisble(false);
    };
    document.addEventListener('mousedown', handleClick);

    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!props.authStatus.loggedIn) {
    if (popUpVisible) {
      setPopUpVisisble(false);
    }
    return <></>;
  }

  const togglePopUp = () => setPopUpVisisble(!popUpVisible);

  const logout = () => props.setAuthStatus(initAuthStatus);

  return (
    <>
      <button
        ref={buttonRef}
        onClick={togglePopUp}
        className="bg-white my-2 mx-5 rounded-full w-10 h-10 leading-10 text-black text-center align-middle text-xl"
      >
        MC
      </button>
      <div ref={dropDownRef}
        className={`
          fixed right-0 top-0 mt-16 mr-5 bg-gray-200 rounded-lg border border-gray-400
          flex flex-col justify-between h-40 w-64 text-gray-800 p-4
          ` + (popUpVisible ? 'block' : 'hidden')
        }
      >
        <a href={"/users/"} className="text-lg py-2 hover:text-orange-500 hover:underline border-b border-gray-400">
          <UserIcon className="fill-current w-5 h-5 inline mr-4" />
          User Profile
        </a>
        <a href="#logout" onClick={logout} className="text-lg py-2 hover:text-orange-500 hover:underline border-b border-gray-400">
          <LogoutIcon className="fill-current w-5 h-5 inline mr-4" />
          Logout
        </a>
      </div>
    </>
  );
}
