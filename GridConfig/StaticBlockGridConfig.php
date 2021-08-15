<?php

/**
 * @copyright EveryWorkflow. All rights reserved.
 */

declare(strict_types=1);

namespace EveryWorkflow\StaticBlockBundle\GridConfig;

use EveryWorkflow\CoreBundle\Model\DataObjectInterface;
use EveryWorkflow\DataGridBundle\Factory\ActionFactoryInterface;
use EveryWorkflow\DataGridBundle\Model\Action\ButtonAction;
use EveryWorkflow\DataGridBundle\Model\Action\ConfirmedActionButton;
use EveryWorkflow\DataGridBundle\Model\DataGridConfig;

class StaticBlockGridConfig extends DataGridConfig implements StaticBlockGridConfigInterface
{
    public function __construct(DataObjectInterface $dataObject, ActionFactoryInterface $actionFactory)
    {
        parent::__construct($dataObject, $actionFactory);
        $this->dataObject->setDataIfNot(self::KEY_IS_FILTER_ENABLED, true);
        $this->dataObject->setDataIfNot(self::KEY_IS_COLUMN_SETTING_ENABLED, true);
    }

    public function getActiveColumns(): array
    {
        return array_merge(
            ['_id', 'block_title', 'block_key', 'status', 'created_at', 'updated_at'],
            parent::getFilterableColumns()
        );
    }

    public function getFilterableColumns(): array
    {
        return $this->getActiveColumns();
    }

    public function getSortableColumns(): array
    {
        return $this->getActiveColumns();
    }

    public function getHeaderActions(): array
    {
        return array_merge([
            $this->getActionFactory()->create(ButtonAction::class, [
                'label' => 'Create new section',
                'path' => '/cms/static-block/create',
            ]),
        ], parent::getHeaderActions());
    }

    public function getRowActions(): array
    {
        return array_merge([
            $this->getActionFactory()->create(ButtonAction::class, [
                'label' => 'Edit',
                'path' => '/cms/static-block/{_id}/edit',
            ]),
            $this->getActionFactory()->create(ConfirmedActionButton::class, [
                'label' => 'Delete',
                'path' => '/cms/static-block/{_id}/delete',
                'confirm_message' => 'Are you sure, you want to delete this item?',
            ]),
        ], parent::getBulkActions());
    }
}
