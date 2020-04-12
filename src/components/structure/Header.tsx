import React, { useState, ChangeEvent, useContext } from 'react';
import { UserDropdown } from './UserIcon';
import TextInput from './pre-styled/TextInput';
import { AuthContext } from '../../AuthContext';
import { ReactComponent as SearchIcon } from '../zondicons/search.svg'

export const Header: React.FC = () => {
  return (
    <header className="w-screen fixed left-0 top-0 z-50 bg-orange-500 flex items-center justify-between text-white h-14">
      <div className="w-full sm:w-1/2 flex justify-between content-center text-center items-center">
        <h1 className="text-xl my-2 mx-5">SpamTitan Control Panel</h1>
        <SearchBar />
      </div>
      <UserDropdown />
    </header>
  );
}


const SearchBar: React.FC = () => {
  const [search, setSearch] = useState('');
  const { authStatus } = useContext(AuthContext);

  return (
    <div className={"w-1/2 hidden " + (authStatus.loggedIn ? 'sm:block' : 'hidden')}>
      <TextInput placeholder="Search"
        value={search}
        onchangeEvent={(ev: ChangeEvent<HTMLInputElement>) => setSearch(ev.target?.value)}
        icon={SearchIcon}
        className="w-full mb-2" />
    </div>
  );
}
