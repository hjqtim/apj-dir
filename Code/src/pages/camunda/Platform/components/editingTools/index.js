import React, { Component } from 'react';
import style from './index.module.scss';

class EditingTools extends Component {
  handleOpen = () => {
    this.file.click();
  };

  render() {
    const {
      onOpenFIle,
      // onZoomIn,
      // onZoomOut,
      // onZoomReset,
      onUndo,
      onRedo,
      onSave,
      onDownloadXml,
      onDownloadSvg,
      onPreview
      // onPreviewXml
    } = this.props;
    return (
      <div className={style.editingTools}>
        <ul className={style.controlList}>
          <li className={style.control}>
            {/* " line" */}
            <input
              ref={(file) => {
                this.file = file;
              }}
              className={style.openFile}
              type="file"
              onChange={onOpenFIle}
            />
            <button type="button" title="打开BPMN文件" onClick={this.handleOpen}>
              <i className={style.open} />
            </button>
          </li>

          <li className={style.control}>
            <button type="button" title="撤销" onClick={onUndo}>
              <i className={style.undo} />
            </button>
          </li>
          {/* " line" */}
          <li className={style.control}>
            <button type="button" title="恢复" onClick={onRedo}>
              <i className={style.redo} />
            </button>
          </li>
          <li className={style.control}>
            <button type="button" title="下载BPMN文件" onClick={onDownloadXml}>
              <i className={style.download} />
            </button>
          </li>
          <li className={style.control}>
            <button type="button" title="下载流程图片" onClick={onDownloadSvg}>
              <i className={style.image} />
            </button>
          </li>

          <li className={style.control}>
            <button type="button" title="查看流程xml" onClick={onPreview}>
              <i className={style.preview} />
            </button>
          </li>
          <li className={style.control}>
            <button type="button" title="保存流程" onClick={onSave}>
              <i className={style.save} />
            </button>
          </li>
        </ul>
      </div>
    );
  }
}

export default EditingTools;
