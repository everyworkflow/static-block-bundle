/*
 * @copyright EveryWorkflow. All rights reserved.
 */

import React, {useContext, useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import PanelContext from "@EveryWorkflow/AdminPanelBundle/Admin/Context/PanelContext";
import DataFormInterface from "@EveryWorkflow/DataFormBundle/Model/DataFormInterface";
import {ACTION_SET_PAGE_TITLE} from "@EveryWorkflow/AdminPanelBundle/Admin/Reducer/PanelReducer";
import AbstractFieldInterface from "@EveryWorkflow/DataFormBundle/Model/Field/AbstractFieldInterface";
import Remote from "@EveryWorkflow/AdminPanelBundle/Admin/Service/Remote";
import PushAlertAction from "@EveryWorkflow/AdminPanelBundle/Admin/Action/PushAlertAction";
import PageHeaderComponent from "@EveryWorkflow/AdminPanelBundle/Admin/Component/PageHeaderComponent";
import BreadcrumbComponent from "@EveryWorkflow/AdminPanelBundle/Admin/Component/BreadcrumbComponent";
import DataFormComponent from "@EveryWorkflow/DataFormBundle/Component/DataFormComponent";
import {FORM_TYPE_HORIZONTAL} from "@EveryWorkflow/DataFormBundle/Component/DataFormComponent/DataFormComponent";
import PageBuilderComponent from "@EveryWorkflow/PageBuilderBundle/Component/PageBuilderComponent";
import {MODE_EDIT} from "@EveryWorkflow/PageBuilderBundle/Component/PageBuilderComponent/PageBuilderComponent";
import PageBuilderInterface from "@EveryWorkflow/PageBuilderBundle/Model/PageBuilderInterface";
import {ALERT_TYPE_ERROR, ALERT_TYPE_SUCCESS} from "@EveryWorkflow/CoreBundle/Action/AlertAction";

const SUBMIT_SAVE_CHANGES = 'save_changes';
const SUBMIT_SAVE_CHANGES_AND_CONTINUE = 'save_changes_and_continue';

const StaticBlockFormPage = () => {
    const {dispatch: panelDispatch} = useContext(PanelContext);
    const {uuid = ''}: { uuid: string } = useParams();
    const history = useHistory();
    const [form] = Form.useForm();
    const [dataForm, setDataForm] = useState<DataFormInterface>();
    const [pageBuilderData, setPageBuilderData] = useState<PageBuilderInterface | undefined>();
    let submitAction: string | undefined = undefined;

    useEffect(() => {
        panelDispatch({
            type: ACTION_SET_PAGE_TITLE,
            payload: uuid !== '' ? 'Edit static block' : 'Create static block',
        });

        const handleResponse = (response: any) => {
            if (response.item?.page_builder_data?.block_data) {
                setPageBuilderData(response.item.page_builder_data);
            } else {
                setPageBuilderData({block_data: []});
            }
            response.data_form.fields.forEach((item: AbstractFieldInterface) => {
                if (
                    item.name &&
                    response.item &&
                    Object.prototype.hasOwnProperty.call(response.item, item.name)
                ) {
                    item.value = response.item[item.name];
                }
            });
            setDataForm(response.data_form);
        };

        const fetchItem = async () => {
            try {
                const response: any = await Remote.get(
                    uuid !== '' ? '/cms/static-block/' + uuid : '/cms/static-block/create'
                );
                handleResponse(response);
            } catch (error: any) {
                await PushAlertAction({
                    message: error.message,
                    title: 'Fetch error',
                    type: ALERT_TYPE_ERROR,
                })(panelDispatch);
            }
        };

        fetchItem();
    }, [panelDispatch, uuid]);

    const onSubmit = async (data: any) => {
        const submitData: any = {
            page_builder_data: pageBuilderData,
        };
        for (const name in data) {
            if (data.hasOwnProperty(name)) {
                submitData[name] = data[name];
            }
        }

        const handlePostResponse = (response: any) => {
            if (response.message) {
                PushAlertAction({
                    message: response.message,
                    title: 'Form submit success',
                    type: ALERT_TYPE_SUCCESS,
                })(panelDispatch);
            }
            if (submitAction === SUBMIT_SAVE_CHANGES) {
                history.goBack();
            }
        };

        try {
            const response = await Remote.post(
                uuid !== '' ? '/cms/static-block/' + uuid : '/cms/static-block/create',
                submitData
            );
            handlePostResponse(response);
        } catch (error: any) {
            await PushAlertAction({
                message: error.message,
                title: 'Submit error',
                type: ALERT_TYPE_ERROR,
            })(panelDispatch);
        }
    };

    return (
        <>
            <PageHeaderComponent
                title={uuid !== '' ? `ID: ${uuid}` : undefined}
                actions={[
                    {
                        label: 'Save changes',
                        onClick: () => {
                            submitAction = SUBMIT_SAVE_CHANGES;
                            form.submit();
                        },
                    },
                    {
                        label: 'Save and continue',
                        onClick: () => {
                            submitAction = SUBMIT_SAVE_CHANGES_AND_CONTINUE;
                            form.submit();
                        },
                    },
                ]}
            />
            <BreadcrumbComponent/>
            <Card
                className="app-container"
                title={'General'}
                style={{marginBottom: 24}}>
                {dataForm && (
                    <DataFormComponent
                        form={form}
                        formData={dataForm}
                        formType={FORM_TYPE_HORIZONTAL}
                        onSubmit={onSubmit}
                    />
                )}
            </Card>
            <Card
                className="app-container"
                title={'Page builder'}
                style={{marginBottom: 24}}
                bodyStyle={{display: 'none'}}
            />
            <div className="app-container">
                {pageBuilderData && <PageBuilderComponent
                    pageBuilderData={pageBuilderData}
                    mode={MODE_EDIT}
                    onChange={(data) => {
                        setPageBuilderData(data);
                    }}/>}
            </div>
        </>
    );
};

export default StaticBlockFormPage;