/*
 * @copyright EveryWorkflow. All rights reserved.
 */

import React, { useContext, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import PanelContext from "@EveryWorkflow/PanelBundle/Context/PanelContext";
import { ACTION_SET_PAGE_TITLE } from "@EveryWorkflow/PanelBundle/Reducer/PanelReducer";
import DataGridComponent from "@EveryWorkflow/DataGridBundle/Component/DataGridComponent";
import { DATA_GRID_TYPE_PAGE } from "@EveryWorkflow/DataGridBundle/Component/DataGridComponent/DataGridComponent";

const ListStaticBlockPage = () => {
    const { dispatch: panelState } = useContext(PanelContext);
    const location = useLocation();

    useEffect(() => {
        panelState({ type: ACTION_SET_PAGE_TITLE, payload: 'Static block' });
    }, [panelState]);

    return (
        <>
            <DataGridComponent
                dataGridUrl={'/cms/static-block' + location.search}
                dataGridType={DATA_GRID_TYPE_PAGE}
            />
        </>
    );
};

export default ListStaticBlockPage;
