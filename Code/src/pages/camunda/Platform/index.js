import React from 'react';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/camunda';
import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda';
import localStorage from 'localStorage';
import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import EditingTools from './components/editingTools';
import { xmlstr } from './untils/testxml';
// import axios from "axios";
// material-ui
import CustomizedDialogs from './components/dialog/showXmlDialog';
import FormDialog from './components/dialog/submitDialog';
import style from './index.module.scss';
import API from '../../../api/camunda';
import { getQueryVariable } from './untils/common';
// import { tenant_id } from './api/constant'
// 以下为bpmn工作流绘图工具样式
import 'bpmn-js/dist/assets/diagram-js.css'; // 左边工具栏以及编辑节点样式
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import { WarningDialog } from '../../../components';

class Platform extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openAlert: false,
      alertMsg: '',
      alertType: 'error',
      // openXmlDialog: false,
      xmlContent: '',
      modifyType: false,
      saveDialog: false
    };
    this.cid = getQueryVariable('id');
    this.xmls = xmlstr;
    this.bpmnModeler = null;
  }

  componentWillMount() {
    // 拦截判断是否离开当前页面
    window.addEventListener('beforeunload', (e) => this.beforeunload(e, this.state.modifyType));
  }

  componentDidMount() {
    this.initBpmn();
    this.addEventBusListener();

    const bjs = document.querySelector('.bjs-powered-by');
    bjs.style.display = 'none';
  }

  initBpmn = () => {
    this.bpmnModeler = new BpmnModeler({
      container: '#canvas',
      height: '100vh',
      // 添加控制面板
      propertiesPanel: {
        parent: '.properties-panel'
      },
      additionalModules: [propertiesPanelModule, propertiesProviderModule],
      moddleExtensions: {
        camunda: camundaModdleDescriptor
      }
    });
    this.createBpmnDiagram();
  };

  createBpmnDiagram = async () => {
    console.log(this.cid);
    if (this.cid) {
      try {
        // if (tenant_id) {
        //   url = '/engine-rest/process-definition/key/' + this.cid + '/tenant-id/' + tenant_id + '/xml';
        // } else {
        //   url = '/engine-rest/process-definition/key/' + this.cid + '/xml';
        // }
        const res = await API.getModelFile(this.cid);
        console.log(res);
        if (res.data.data.bpmn20Xml) {
          this.xmls = res.data.data.bpmn20Xml;
        }
      } catch (e) {
        // this.showAlert('没有获取到数据');
      }
    } else if (localStorage.getItem('xmldata')) {
      // this.xmls = localStorage.getItem("xmldata");
    }
    await this.bpmnModeler.importXML(this.xmls);
  };

  addEventBusListener = () => {
    console.log('addEventBusListener: ----------------------');
    const that = this;
    console.log(this);
    console.log(this.state.modifyType);
    const eventBus = this.bpmnModeler.get('eventBus'); // 需要使用eventBus
    const eventTypes = ['element.changed']; // 需要监听的事件集合
    eventTypes.forEach((eventType) => {
      eventBus.on(eventType, () => {
        that.bpmnModeler.saveXML({ format: true }, (err, data) => {
          that.setState({
            modifyType: true
          });
          localStorage.setItem('xmldata', data);
        });
      });
    });
  };

  handleClosePanel = () => {
    const proPanel = document.getElementById('pro-panel');
    if (proPanel.style.right === '-300px') {
      proPanel.style.right = '0';
    } else {
      proPanel.style.right = '-300px';
    }
  };

  showAlert = (msg, type = 'error') => {
    this.setState({
      alertType: type,
      openAlert: true,
      alertMsg: msg
    });
    setTimeout(() => {
      this.setState({
        openAlert: false
      });
    }, 3000);
  };

  download = (type, data, name) => {
    let dataTrack = '';
    const a = document.createElement('a');

    switch (type) {
      case 'xml':
        dataTrack = 'bpmn';
        break;
      case 'svg':
        dataTrack = 'svg';
        break;
      default:
        break;
    }

    name = name || `diagram.${dataTrack}`;

    a.setAttribute('href', `data:application/bpmn20-xml;charset=UTF-8,${encodeURIComponent(data)}`);
    a.setAttribute('target', '_blank');
    a.setAttribute('dataTrack', `diagram:download-${dataTrack}`);
    a.setAttribute('download', name);

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 渲染 xml 格式
  renderDiagram = (xml) => {
    this.bpmnModeler.importXML(xml, (err) => {
      if (err) {
        console.log(err);
        console.log(xml);
      }
    });
  };

  // 后退
  handleUndo = () => {
    this.bpmnModeler.get('commandStack').undo();
  };

  // 前进
  handleRedo = () => {
    this.bpmnModeler.get('commandStack').redo();
  };

  // 导入 xml 文件
  handleOpenFile = (e) => {
    const that = this;
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      let data = '';
      reader.readAsText(file);
      console.log(file);
      reader.onload = (event) => {
        console.log(event);
        data = event.target.result;
        that.renderDiagram(data, 'open');
      };
    }
  };

  // 下载 SVG 格式
  handleDownloadSvg = () => {
    this.bpmnModeler.saveSVG({ format: true }, (err, data) => {
      this.download('svg', data);
    });
  };

  // 下载 XML 格式
  handleDownloadXml = () => {
    this.bpmnModeler.saveXML({ format: true }, (err, data) => {
      this.download('xml', data);
    });
  };

  // 打开modal查看xml
  handlePreview = () => {
    const that = this;
    this.bpmnModeler.saveXML({ format: true }, (err, data) => {
      that.setState({
        xmlContent: data
      });
      that.child.handleClickOpen();
    });
  };

  // 保存
  handleSave = () => {
    // let bpmnXml = '';
    // let svgXml = '';
    // // let that = this;
    // this.bpmnModeler.saveXML({ format: true }, (err, xml) => {
    //   bpmnXml = xml;
    // });
    // this.bpmnModeler.saveSVG({ format: true }, (err, data) => {
    //   svgXml = data;
    // });
    if (this.cid) {
      this.setState({
        saveDialog: true
      });
    } else {
      this.childForm.handleClickOpen();
    }
  };

  onRef = (ref) => {
    this.child = ref;
  };

  onRefForm = (ref) => {
    this.childForm = ref;
  };

  // 接收submitDialog数据做处理
  handleSubmitDialog = (values) => {
    let bpmnXml = '';
    const that = this;
    this.bpmnModeler.saveXML({ format: true }, async (err, xml) => {
      bpmnXml = xml;
      const forms = new FormData();
      // forms.append('deployment-name', values['deployment_name']);
      // forms.append('deployment-source', 'Camunda Modeler');
      // forms.append('enable-duplicate-filtering', true);
      // forms.append('tenant-id', values['tenant_id']);
      // 模拟出一个文件
      const blob = new Blob([bpmnXml], { type: 'text/xml' });
      forms.append('modelId', this.cid ? this.cid : values.deployment_name);
      forms.append('file', blob, `${this.cid}.bpmn`);

      try {
        // const res = await $ajax('/engine-rest/deployment/create', forms, 'POST');
        await API.saveModel(forms);
        that.showAlert('发布成功', 'Success');
        localStorage.setItem('deployment_name', values.deployment_name);
        localStorage.setItem('tenant_id', values.tenant_id);
        that.childForm.handleClose();
        this.closeSaveDialog();
        // that.setState({
        //   modifyType: false
        // })
        // window.close();
      } catch (e) {
        that.showAlert(e, 'error');
      }
    });
  };

  closeSaveDialog = () => {
    this.setState({
      saveDialog: false
    });
  };

  handleSaveDialog = () => {
    const deployment_name = localStorage.getItem('deployment_name') || '';
    const tenant_id = localStorage.getItem('tenant_id') || '';
    const saveParams = {
      deployment_name,
      tenant_id
    };
    this.handleSubmitDialog(saveParams);
  };

  beforeunload(e, modifyType) {
    const confirmationMessage = '你确定离开此页面吗?';
    if (modifyType) {
      (e || window.event).returnValue = confirmationMessage;
    }
    // return confirmationMessage;
  }

  render() {
    return (
      <div className={style.root}>
        <div className="App">
          <div id="canvas" className="container" />
          <div className="properties-panel" id="pro-panel">
            <div id="close-pannel" className="close-panel" onClick={this.handleClosePanel}>
              {this.state.modifyType}
            </div>
          </div>
          <EditingTools
            onOpenFIle={this.handleOpenFile}
            onUndo={this.handleUndo}
            onRedo={this.handleRedo}
            onSave={this.handleSave}
            onDownloadSvg={this.handleDownloadSvg}
            onDownloadXml={this.handleDownloadXml}
            onPreview={this.handlePreview}
          />
          <Snackbar
            open={this.state.openAlert}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert severity={this.state.alertType} sx={{ width: '100%' }}>
              {this.state.alertMsg}
            </Alert>
          </Snackbar>
          <CustomizedDialogs onRef={this.onRef} xml={this.state.xmlContent} />
          <FormDialog onRef={this.onRefForm} handleForm={this.handleSubmitDialog} />
        </div>

        {/* save dialog */}
        <WarningDialog
          title="Warning"
          open={this.state.saveDialog}
          handleConfirm={this.handleSaveDialog}
          handleClose={this.closeSaveDialog}
          content="Are you sure you want to save it?"
        />
      </div>
    );
  }
}

export default Platform;
