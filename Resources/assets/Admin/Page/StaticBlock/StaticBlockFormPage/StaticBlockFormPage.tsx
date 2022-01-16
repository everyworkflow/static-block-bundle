/*
 * @copyright EveryWorkflow. All rights reserved.
 */

import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from 'antd/lib/card';
import Form from 'antd/lib/form';
import PanelContext from "@EveryWorkflow/PanelBundle/Context/PanelContext";
import { ACTION_SET_PAGE_TITLE } from "@EveryWorkflow/PanelBundle/Reducer/PanelReducer";
import Remote from "@EveryWorkflow/PanelBundle/Service/Remote";
import PageHeaderComponent from "@EveryWorkflow/AdminPanelBundle/Component/PageHeaderComponent";
import BreadcrumbComponent from "@EveryWorkflow/AdminPanelBundle/Component/BreadcrumbComponent";
import DataFormComponent from "@EveryWorkflow/DataFormBundle/Component/DataFormComponent";
import PageBuilderComponent from "@EveryWorkflow/PageBuilderBundle/Component/PageBuilderComponent";
import { MODE_EDIT } from "@EveryWorkflow/PageBuilderBundle/Component/PageBuilderComponent/PageBuilderComponent";
import PageBuilderInterface from "@EveryWorkflow/PageBuilderBundle/Model/PageBuilderInterface";
import AlertAction, { ALERT_TYPE_ERROR, ALERT_TYPE_SUCCESS } from "@EveryWorkflow/PanelBundle/Action/AlertAction";
import { FORM_TYPE_HORIZONTAL } from "@EveryWorkflow/DataFormBundle/Component/DataFormComponent/DataFormComponent";
import ValidationError from '@EveryWorkflow/PanelBundle/Error/ValidationError';

const SUBMIT_SAVE_CHANGES = 'save_changes';
const SUBMIT_SAVE_CHANGES_AND_CONTINUE = 'save_changes_and_continue';

const StaticBlockFormPage = () => {
    const { dispatch: panelDispatch } = useContext(PanelContext);
    const { uuid = 'create' }: any = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formErrors, setFormErrors] = useState<any>();
    const [remoteData, setRemoteData] = useState<any>();
    const [pageBuilderData, setPageBuilderData] = useState<PageBuilderInterface | undefined>();
    let submitAction: string | undefined = undefined;

    useEffect(() => {
        panelDispatch({
            type: ACTION_SET_PAGE_TITLE,
            payload: uuid !== 'create' ? 'Edit static block' : 'Create static block',
        });

        const handleResponse = (response: any) => {
            if (response.item?.page_builder_data?.block_data) {
                setPageBuilderData(response.item.page_builder_data);
            } else {
                setPageBuilderData({ block_data: [] });
            }
            setRemoteData(response);
        };

        const fetchItem = async () => {
            try {
                const response: any = await Remote.get('/cms/static-block/' + uuid);
                handleResponse(response);
            } catch (error: any) {
                AlertAction({
                    description: error.message,
                    message: 'Fetch error',
                    type: ALERT_TYPE_ERROR,
                });
            }
        };

        fetchItem();
    }, [panelDispatch, uuid]);

    const onSubmit = async (data: any) => {
        const submitData: any = {
            page_builder_data: pageBuilderData,
        };
        Object.keys(data).forEach(name => {
            if (data[name] !== undefined) {
                submitData[name] = data[name];
            }
        });

        const handlePostResponse = (response: any) => {
            AlertAction({
                description: response.detail,
                message: 'Form submit success',
                type: ALERT_TYPE_SUCCESS,
            });
            if (submitAction === SUBMIT_SAVE_CHANGES) {
                navigate(-1);
            }
        };

        try {
            const response = await Remote.post('/cms/static-block/' + uuid, submitData);
            handlePostResponse(response);
        } catch (error: any) {
            if (error instanceof ValidationError) {
                setFormErrors(error.errors);
            }

            AlertAction({
                description: error.message,
                message: 'Submit error',
                type: ALERT_TYPE_ERROR,
            });
        }
    };

    const getHeaderActions = () => {
        const headerActions: Array<any> = [
            {
                button_label: 'Save changes',
                button_type: 'primary',
                onClick: () => {
                    submitAction = SUBMIT_SAVE_CHANGES;
                    form.submit();
                },
            },
        ];

        if (uuid && uuid !== 'create') {
            headerActions.push({
                button_label: 'Save changes and continue',
                button_type: 'primary',
                onClick: () => {
                    submitAction = SUBMIT_SAVE_CHANGES_AND_CONTINUE;
                    form.submit();
                },
            });
        }
        
        return headerActions;
    }

    return (
        <>
            <PageHeaderComponent
                title={uuid !== 'create' ? `ID: ${uuid}` : undefined}
                actions={getHeaderActions()}
            />
            <BreadcrumbComponent />
            <Card
                className="app-container"
                title={'General'}
                style={{ marginBottom: 24 }}>
                {remoteData && (
                    <DataFormComponent
                        form={form}
                        initialValues={remoteData.item}
                        formErrors={formErrors}
                        formData={remoteData.data_form}
                        formType={FORM_TYPE_HORIZONTAL}
                        onSubmit={onSubmit}
                    />
                )}
            </Card>
            <Card
                className="app-container"
                title={'Page builder'}
                style={{ marginBottom: 24 }}
                bodyStyle={{ display: 'none' }}
            />
            <div className="app-container">
                {pageBuilderData && <PageBuilderComponent
                    pageBuilderData={pageBuilderData}
                    mode={MODE_EDIT}
                    onChange={(data) => {
                        setPageBuilderData(data);
                    }} />}
            </div>
        </>
    );
};

export default StaticBlockFormPage;
