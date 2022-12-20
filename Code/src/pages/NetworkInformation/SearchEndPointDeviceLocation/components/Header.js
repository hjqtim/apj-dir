import React, { useState, useEffect } from 'react';
import { SearchBar } from '../../../../components';

export default function Header({ handleSearch, setData, setAllIsNull }) {
  const [queryParams, setQueryParams] = useState('160.42.163.223');
  const [error, setError] = useState(false);

  const Search = () => {
    if (queryParams) {
      handleSearch(queryParams);
      setError(false);
    } else {
      setError(true);
    }
  };
  const handleClear = () => {
    setError(false);
    setAllIsNull(true);
    setQueryParams('');
    setData({});
    //
  };

  useEffect(() => {
    if (queryParams) {
      setError(false);
    }
  }, [queryParams]);

  // 搜索字段
  const searchBarFieldList = [
    {
      label: 'Device IP Address / Hostname',
      type: 'text',
      disabled: false,
      value: queryParams,
      name: 'addressHostname',
      style: { width: '300px' },
      error
    }
  ];

  return (
    <div>
      <SearchBar
        onSearchFieldChange={(e) => {
          setQueryParams(e.target.value);
        }}
        onSearchButton={Search}
        onClearButton={handleClear}
        fieldList={searchBarFieldList}
      />
    </div>
  );
}
