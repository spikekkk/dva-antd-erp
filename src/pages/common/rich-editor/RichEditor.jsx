import React from 'react';
import styles from './RichEditor.less';

class RichEditor extends React.Component {
  constructor() {
    super();
    this.state = {
      html: this.props.value,
    };
  }

  componentDidMount() {
    const editor = UE.getEditor(this.props.UEId, {
      serverUrl: BASE_URL + '/ueditormgr/action',
      //工具栏
      toolbars: [
        [
          'fullscreen',
          'source',
          '|',
          'undo',
          'redo',
          '|',
          'bold',
          'italic',
          'underline',
          'fontborder',
          'strikethrough',
          'superscript',
          'subscript',
          'removeformat',
          'formatmatch',
          '|',
          'forecolor',
          'backcolor',
          'insertorderedlist',
          'insertunorderedlist',
          'selectall',
          'cleardoc',
          '|',
          'rowspacingtop',
          'rowspacingbottom',
          'lineheight',
          '|',
          'customstyle',
          'paragraph',
          'fontfamily',
          'fontsize',
          '|',
          'directionalityltr',
          'directionalityrtl',
          'indent',
          '|',
          'justifyleft',
          'justifycenter',
          'justifyright',
          'justifyjustify',
          '|',
          'touppercase',
          'tolowercase',
          '|',
          'imagenone',
          'imageleft',
          'imageright',
          'imagecenter',
          '|',
          'simpleupload',
          'horizontal',
          'date',
          'time',
          'template',
        ],
      ],
      lang: 'zh-cn',
      //字体
      fontfamily: [
        { label: '', name: 'songti', val: '宋体,SimSun', },
        { label: '', name: 'kaiti', val: '楷体,楷体_GB2312, SimKai', },
        { label: '', name: 'yahei', val: '微软雅黑,Microsoft YaHei', },
        { label: '', name: 'heiti', val: '黑体, SimHei', },
        { label: '', name: 'lishu', val: '隶书, SimLi', },
        { label: '', name: 'andaleMono', val: 'andale mono', },
        { label: '', name: 'arial', val: 'arial, helvetica,sans-serif', },
        { label: '', name: 'arialBlack', val: 'arial black,avant garde', },
        { label: '', name: 'comicSansMs', val: 'comic sans ms', },
        { label: '', name: 'impact', val: 'impact,chicago', },
        { label: '', name: 'timesNewRoman', val: 'times new roman', },
      ],
      //字号
      fontsize: [10, 11, 12, 14, 16, 18, 20, 24, 36,],
      enableAutoSave: false,
      autoHeightEnabled: false,
      initialFrameHeight: '400px',
      initialFrameWidth: '100%',
      minFrameHeight: 400, //编辑器拖动时最小高度,默认220
      readonly: this.props.disabled || false,
    });
    const me = this;
    editor.ready(function(ueditor) {
      const value = me.state.html ? me.props.value : '<p></p>';
      editor.setContent(value);
    });
  }

  componentWillReceiveProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({
        html: value,
      });

      UE.getEditor(this.props.UEId).setContent(value);
    }
  }

  render() {
    return (
      <div className="common_rich_editor_cont">
        <script id={this.props.UEId}
          name="content"
          type="text/plain"
        />
      </div>
    );
  }
}
export default RichEditor;
