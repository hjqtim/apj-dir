import React, { useRef, useMemo } from 'react';
import { HashRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';
import theme from '../../utils/theme';
import store from '../../redux';
import { setPage } from '../../redux/page/pageActions';

function CommonPage(props) {
  const {
    List,
    Detail,
    Update,
    Create,
    Step,
    title,
    CreateWithId,
    detaiEditShow,
    customAction,
    refresh
  } = props;

  const { location } = useHistory();
  const linkEl = useRef(null);

  const storeListener = () => {
    if (!linkEl.current) return;
    const { toListPage } = store.getState().pageReducer.currentPage;
    if (toListPage) {
      linkEl.current.click();
      store.dispatch(
        setPage(
          Object.assign(store.getState().pageReducer.currentPage, {
            toListPage: false
          })
        )
      );
    }
  };

  store.subscribe(storeListener);

  const map = useMemo(() => new Map(), [window.location.href]);

  return (
    <div
      style={{
        marginTop: '2em',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
    >
      {!(
        detaiEditShow &&
        (location?.hash.includes('update') || location?.hash.includes('detail'))
      ) && (
        <div
          style={{
            fontSize: theme.font.important.size,
            lineHeight: theme.font.important.lineHeight,
            fontWeight: 'bolder',
            color: theme.color.sub.mainText
          }}
        >
          {title}
          {customAction && customAction}
        </div>
      )}

      <Router>
        <Link to="/" ref={linkEl} style={{ display: 'none' }}>
          {' '}
          hide link, to list page{' '}
        </Link>
        <Switch>
          <Route path="/detail/:id?">{Detail && (() => <Detail path="" map={map} />)}</Route>
          <Route path="/update/:id?">{Update && (() => <Update path="" map={map} />)}</Route>
          <Route path={CreateWithId ? '/create/:id' : '/create'}>
            {Create && (() => <Create path="" map={map} />)}
          </Route>
          <Route path="/step/:id">{Step && (() => <Step path="" />)}</Route>
          <Route path="/">{List && (() => <List path="" refresh={refresh} />)}</Route>
        </Switch>
      </Router>
    </div>
  );
}

export default CommonPage;
