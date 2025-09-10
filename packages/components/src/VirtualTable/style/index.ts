import type {CSSObject} from "ant-design-vue";
import genCompoentStyle from "../../style/styleRegister";

const genVirtualTableStyle = (): CSSObject => {
    return {
        '.virtual-table-wrapper': {
            display: 'flex',
            'flex-direction': 'column',
            '.virtual-table-header': {
                '.ant-table': {
                    '.ant-table-container': {
                        '.ant-table-content': {
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
