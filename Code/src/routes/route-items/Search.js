import React from 'react';
import FindInPageOutlinedIcon from '@material-ui/icons/FindInPageOutlined';
import SearchDetail from '../../pages/Search';

const Search = {
  id: 'Search',
  name: 'Search',
  path: '/search',
  icon: <FindInPageOutlinedIcon />,
  component: SearchDetail,
  children: null
};

export default Search;
