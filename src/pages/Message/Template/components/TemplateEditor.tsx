import { CreateMessageTemplate, GetRenderedMessagePreview, UpdateMessageTemplate } from '@/services/paasport/message/message_umirequest';
import { ModalForm, ProFormCheckbox, ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { Button } from 'antd';
import { Base64 } from 'js-base64';
import React from 'react'

const TemplateEditor: React.FC<{
    visible: boolean,
    model: string,
    templateInfo: MESSAGE.MessageTemplateInfo,
    cancel: (visible: boolean) => void
}> = (props) => {
    const { visible, templateInfo, model, cancel } = props
    console.log("templateInfo", templateInfo, templateInfo.id, visible)
    const onPreview = async (value: MESSAGE.MessageTemplateInfo) => {
        let resp = await GetRenderedMessagePreview({
            ...value,
            content: Base64.encode(value.content),
            render_self: value.render_self ? 1 : 0,
        })
        if (window.previewWindow) {
            window.previewWindow.close()
        }

        window.previewWindow = window.open()
        window.previewWindow.document.write(resp.content)
        window.previewWindow.document.close()
    }
    return (
        <ModalForm<MESSAGE.MessageTemplateReq>
            title={model == "create" ? "新建" : "更新"}
            visible={visible}
            autoFocusFirstInput
            layout='horizontal'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            modalProps={{
                onCancel: () => cancel(!visible),
                destroyOnClose: true,
                style: { top: 20 },
                okText: model == "create" ? "新建" : "更新"
            }}
            submitTimeout={2000}
            submitter={{
                render: (props, defaultDoms) => {
                    return [
                        ...defaultDoms,
                        <Button type='dashed' onClick={() => {
                            onPreview(props.form?.getFieldsValue())
                        }}>预览</Button>
                    ]
                },
            }}
            onFinish={async (values) => {
                if (model == "create") {
                    await CreateMessageTemplate({
                        ...values,
                        content: Base64.encode(values.content),
                        render_self: values.render_self ? 1 : 0,
                    })
                } else {
                    await UpdateMessageTemplate({
                        ...values,
                        content: Base64.encode(values.content),
                        render_self: values.render_self ? 1 : 0,
                    })
                }
                return true;
            }}
            onVisibleChange={(visible: boolean) => {
                cancel(visible)
            }}
            initialValues={{
                ...templateInfo,
                content_type: model == "update" ? templateInfo.content_type : "text/html",
                params: model == "update" ? JSON.stringify(JSON.parse(templateInfo.params), null, 2) : "{}",
                type: model == 'create' ? 1 : templateInfo.type
            }}
        >
            <ProFormText name="id" disabled label="ID" style={{ display: 'none' }} />
            <ProFormText name="name" label="名称" placeholder="模版名称" />
            <ProFormText name="title" label="标题" placeholder="标题" tooltip="邮件subject" />
            <ProFormText name="sign_name" label="签名" initialValue="Paasport" />
            <ProFormText name="template_code" label="第三方模版ID" />
            <ProFormCheckbox name="render_self" label="是否自渲染" />
            <ProFormSelect name="type" label="模版类型" options={[
                {
                    value: 0,
                    label: "系统消息模版"
                }, {
                    value: 1,
                    label: "邮件消息模版"
                }, {
                    value: 2,
                    label: "短信消息模版"
                }
            ]} />
            <ProFormSelect name="content_type" label="模版内容类型" options={[
                {
                    value: 'text/html',
                    label: 'html',
                },
            ]} />
            <ProFormTextArea name="params"
                fieldProps={{ autoSize: { minRows: 5, maxRows: 10 } }}
                label="模版参数" />
            <ProFormTextArea name="content"
                fieldProps={{ autoSize: { minRows: 10, maxRows: 20 } }}
                label="模版内容" />
        </ModalForm >
    )
}

export default TemplateEditor;