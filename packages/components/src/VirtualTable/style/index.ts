import type {CSSObject} from "ant-design-vue";
import genCompoentStyle from "../../style/styleRegister";

const genVirtualTableStyle = (): CSSObject => {
    return {
        '.virtual-table-wrapper': {
            display: 'flex',
            'flex-direction': 'column',
            '.virtual-table-header': {
                overflow: 'hidden',
                '.ant-table': {
                    '.ant-table-container': {
                        '.ant-table-content': {
                            overflow: 'hidden !important',
                            '.ant-table-tbody': {
                                display: 'none'
                            }
                        }
                    }
                }
            },
            '.virtual-table-body': {
                'overflow-y': 'auto',
                position: 'relative',
                'min-height': '100px'
            },
            '.virtual-table-header-fixed': {
                // 位移的容器，提升位移动画性能
                'will-change': 'transform'
            },
            '.virtual-table-row-expand-icon': {
                'margin-right': '8px',
                'font-size': 'relative',
                width: '16px',
                display: 'inline-block'
            }
        },
    }
}

export default genCompoentStyle([genVirtualTableStyle])