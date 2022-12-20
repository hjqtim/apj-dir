import fontFamily from '../../../fontFamily';

class CamundaCommon {
  constructor() {
    this.container = {
      backgroundColor: '#fff',
      borderRadius: '1em',
      marginTop: '1em',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    };
    this.CamundaContainer = {
      width: '85%',
      maxWidth: '1000px',
      minHeight: '60vh',
      padding: '1em 1em 1em 1em',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
      // backgroundColor:'red'
    };
    this.parentTitle = {
      width: '100%',
      padding: '0 0',
      margin: '1em 0 1em 1em',
      textAlign: 'left'
    };
    this.parent = {
      //   backgroundColor: 'red',
      minHeight: '20vh',
      width: '100%',
      overflow: 'auto',
      padding: '2em 1em'
    };
    this.parentRawData = {
      padding: '0 2em 0 0',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    };
    this.child = {
      // marginTop: '5vh',
      minHeight: '20vh',
      width: '100%'
    };
    this.childTable = {};
    this.childForm = {
      dialog: {
        minHeight: '90vh',
        minWidth: '800px',
        borderRadius: '1em'
      },
      content: {
        marginTop: '2em',
        padding: '1em 2em',
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
      },
      formElementContainer: {
        width: '45%'
      },
      actions: {
        display: 'flex',
        justifyContent: 'center'
      }
    };
    this.childFormTitle = {};
    this.actions = {
      width: '100%',
      marginTop: '5em',
      display: 'flex',
      justifyContent: 'center'
    };
    this.commonElement = {
      root: {
        width: '90%',
        marginBottom: '2em',
        marginLeft: '2em',
        marginRight: '4em'
      },
      label: {
        fontSize: '1.2em',
        color: 'rgba(0,0,0,.85)',
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none'
      },
      input: {},
      helperText: {
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        color: '#f44336',
        height: '1vh',
        lineHeight: '1vh',
        fontSize: '0.95em',
        fontFamily,
        marginTop: '0.5em'
      }
    };
    this.commonElementForCamunda = {
      root: {
        width: '80%',
        padding: '1rem 1rem 0 1rem',
        marginBottom: '0.5em'
        // marginLeft: '1em',
        // marginTop:'1em'
        // marginRight: 'em'
      },
      label: {
        fontSize: '1em',
        color: 'rgba(0,0,0,.85)',
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none'
      },
      input: {},
      helperText: {
        '-webkit-user-select': 'none',
        '-moz-user-select': 'none',
        color: '#f44336',
        height: '0.8vh',
        lineHeight: '0.8vh',
        fontSize: '0.5em',
        fontFamily,
        marginTop: '0.5em'
      }
    };
  }
}

export default CamundaCommon;
