<?php

/**
 * @copyright EveryWorkflow. All rights reserved.
 */

declare(strict_types=1);

namespace EveryWorkflow\StaticBlockBundle\Form;

use EveryWorkflow\CoreBundle\Model\DataObjectInterface;
use EveryWorkflow\DataFormBundle\Factory\FieldOptionFactoryInterface;
use EveryWorkflow\DataFormBundle\Factory\FormFieldFactoryInterface;
use EveryWorkflow\DataFormBundle\Field\Select\Option;
use EveryWorkflow\DataFormBundle\Model\Form;

class StaticBlockForm extends Form implements StaticBlockFormInterface
{
    protected FieldOptionFactoryInterface $fieldOptionFactory;

    public function __construct(
        DataObjectInterface $dataObject,
        FormFieldFactoryInterface $formFieldFactory,
        FieldOptionFactoryInterface $fieldOptionFactory
    ) {
        parent::__construct($dataObject, $formFieldFactory);
        $this->fieldOptionFactory = $fieldOptionFactory;
    }

    public function getFields(): array
    {
        $fields = [
            $this->formFieldFactory->createField([
                'label' => 'UUID',
                'name' => '_id',
                'is_readonly' => true,
            ]),
            $this->formFieldFactory->createField([
                'label' => 'Block title',
                'name' => 'block_title',
                'field_type' => 'text_field',
            ]),
            $this->formFieldFactory->createField([
                'label' => 'Block key',
                'name' => 'block_key',
                'field_type' => 'text_field',
            ]),
            $this->formFieldFactory->createField([
                'label' => 'Status',
                'name' => 'status',
                'field_type' => 'select_field',
                'options' => [
                    $this->fieldOptionFactory->create(Option::class, [
                        'key' => 'enable',
                        'value' => 'Enable',
                    ]),
                    $this->fieldOptionFactory->create(Option::class, [
                        'key' => 'disable',
                        'value' => 'Disable',
                    ]),
                ],
            ]),
            $this->formFieldFactory->createField([
                'label' => 'Created at',
                'name' => 'created_at',
                'is_readonly' => true,
                'field_type' => 'date_time_picker_field',
            ]),
            $this->formFieldFactory->createField([
                'label' => 'Updated at',
                'name' => 'updated_at',
                'is_readonly' => true,
                'field_type' => 'date_time_picker_field',
            ]),
        ];

        $sortOrder = 5;
        foreach ($fields as $field) {
            $field->setSortOrder($sortOrder++);
        }

        return array_merge($fields, parent::getFields());
    }
}
